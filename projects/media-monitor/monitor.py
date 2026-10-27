"""Collect authorized exports and approved RSS; no model API or browser bypass."""
import argparse
import hashlib
import json
import re
import sys
import zipfile
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler
import xml.etree.ElementTree as ET

COMPANIES = {
    'NF GROUP': ['NF GROUP', 'НФ Групп'],
    'NF GROUP Middle East': ['NF GROUP Middle East'], 'NF PM': ['NF PM'],
    'Nikoliers': ['Nikoliers'], 'IBC Real Estate': ['IBC Real Estate'],
    'CORE.XP': ['CORE.XP'], 'CMWP': ['CMWP'], 'Ricci': ['Ricci'],
    'Intermark': ['Intermark', 'Интермарк'], 'IPG.Estate': ['IPG.Estate'],
    'Метриум Премиум': ['Метриум Премиум'],
    'Kalinka Ecosystem': ['Kalinka Ecosystem'], 'Maris': ['Maris'],
    'Bright Rich': ['Bright Rich'], 'Петербургская недвижимость': ['Петербургская недвижимость'],
    'KNRU': ['KNRU'], 'KR.Consulting': ['KR.Consulting'],
}
# These denials were observed in the browser tool. Do not route them through HTTP.
DENIED = {'realty.ria.ru', 'rg.ru', 'iz.ru', 'tass.ru', 'lenta.ru', 'dzen.ru'}


def normalized(text):
    return re.sub(r'\s+', ' ', text).strip().casefold()


def company_matches(body):
    text = normalized(body)
    result = []
    for company, aliases in COMPANIES.items():
        for alias in aliases:
            match = re.search(r'(?<!\w)' + re.escape(normalized(alias)) + r'(?!\w)', text)
            if match:
                result.append({'company': company, 'evidence': text[max(0, match.start()-100):match.end()+150]})
                break
    return result


def canonical(url):
    parts = urlsplit(url or '')
    if parts.scheme not in ('http', 'https') or not parts.hostname:
        return ''
    return urlunsplit((parts.scheme, parts.netloc, parts.path, '', ''))


def publication_date(value):
    if not value:
        return None
    try:
        date = datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        try:
            date = parsedate_to_datetime(value)
        except (ValueError, TypeError):
            return None
    return date if date.tzinfo is not None else None


class VisibleHTML(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.article_depth = 0
        self.stack = []
        self.parts, self.article, self.title = [], [], []
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style', 'noscript', 'template'):
            self.skip += 1
        if tag == 'article':
            self.article_depth += 1
        if tag not in ('meta', 'link', 'br', 'img', 'hr', 'input', 'source', 'wbr'):
            self.stack.append(tag)
        if tag == 'meta':
            self.meta[attrs.get('property', attrs.get('name', ''))] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.meta['canonical'] = attrs.get('href', '')
        if tag in ('p', 'div', 'br', 'h1', 'h2') and not self.skip:
            self.parts.append('\n')
            if self.article_depth:
                self.article.append('\n')

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript', 'template'):
            self.skip = max(0, self.skip - 1)
        if tag == 'article':
            self.article_depth = max(0, self.article_depth - 1)
        if tag in self.stack:
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]

    def handle_data(self, data):
        if self.skip:
            return
        if 'title' in self.stack:
            self.title.append(data)
        else:
            self.parts.append(data)
            if self.article_depth:
                self.article.append(data)


def html_record(text):
    parser = VisibleHTML()
    parser.feed(text)
    return {'title': parser.meta.get('og:title') or ''.join(parser.title),
            'canonical_url': parser.meta.get('canonical') or parser.meta.get('og:url', ''),
            'published_at': parser.meta.get('article:published_time', ''),
            'body': ' '.join(parser.article or parser.parts),
            'body_scope': 'article' if parser.article else 'page',
            'retrieval_method': 'local_html', 'source_reviewed': False}


def import_file(path):
    suffix = path.suffix.lower()
    if suffix == '.json':
        record = json.loads(path.read_text(encoding='utf-8'))
        if not isinstance(record, dict):
            raise ValueError('Expected a single article JSON object')
    elif suffix in ('.html', '.htm'):
        record = html_record(path.read_text(encoding='utf-8'))
    elif suffix == '.docx':
        with zipfile.ZipFile(path) as package:
            root = ET.fromstring(package.read('word/document.xml'))
        record = {'body': '\n'.join(''.join(p.itertext()) for p in root.iter() if p.tag.endswith('}p')),
                  'retrieval_method': 'local_docx'}
    elif suffix == '.pdf':
        try:
            from pypdf import PdfReader
        except ImportError:
            raise ValueError('For PDF import install pypdf; scanned PDFs require OCR separately')
        record = {'body': '\n'.join(page.extract_text() or '' for page in PdfReader(path).pages),
                  'retrieval_method': 'local_pdf'}
    elif suffix in ('.txt', '.md'):
        record = {'body': path.read_text(encoding='utf-8'), 'retrieval_method': 'local_text'}
    else:
        raise ValueError('Unsupported import format')
    sidecar = path.with_name(path.name + '.meta.json')
    if sidecar.exists():
        record.update(json.loads(sidecar.read_text(encoding='utf-8')))
    record['local_source'] = path.name
    return record


def prepare(record):
    body = record.get('body', '')
    record.setdefault('publisher', '')
    record.setdefault('title', '')
    record.setdefault('published_at', '')
    record.setdefault('publication_timezone', '')
    record['canonical_url'] = canonical(record.get('canonical_url', ''))
    record['company_mentions'] = company_matches(body)
    date = publication_date(record['published_at'])
    record['date_status'] = 'known' if date else 'missing_or_timezone_unknown'
    if date:
        record['utc_offset'] = date.strftime('%z')
    record['verified_speakers'] = []
    for speaker in record.get('speakers', []):
        evidence = speaker.get('evidence', '')
        if (evidence and normalized(evidence) in normalized(body)
                and normalized(speaker.get('name', '')) in normalized(evidence)
                and speaker.get('name')):
            record['verified_speakers'].append(speaker)
    article_body = record.get('body_scope') == 'article'
    record['verification_status'] = (
        'body_mentions_confirmed' if article_body and record.get('source_reviewed')
        and record['company_mentions'] else 'needs_article_review')
    record['retrieved_at'] = record.get('retrieved_at') or datetime.now(timezone.utc).isoformat()
    record['content_sha256'] = hashlib.sha256(body.encode()).hexdigest()
    return record


def permitted(url, hosts):
    parts = urlsplit(url)
    host = parts.hostname or ''
    if parts.scheme != 'https' or parts.username or parts.password:
        raise ValueError('Only HTTPS without embedded credentials is supported')
    if any(host == denied or host.endswith('.' + denied) for denied in DENIED):
        raise ValueError('Explicit tool access denial: network retrieval disabled for this domain')
    if host not in hosts:
        raise ValueError('Host not explicitly approved in configuration')


class CheckedRedirect(HTTPRedirectHandler):
    def __init__(self, hosts):
        self.hosts = hosts

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        permitted(newurl, self.hosts)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def read_feed(source):
    hosts = source.get('approved_hosts', [])
    url = source['url']
    permitted(url, hosts)
    if not source.get('official_endpoint_verified'):
        raise ValueError('Official feed endpoint not verified')
    request = Request(url, headers={'User-Agent': 'NF-MediaMonitor/1.0 (RSS reader)'})
    with build_opener(CheckedRedirect(hosts)).open(request, timeout=25) as response:
        raw = response.read(5_000_001)
    if len(raw) > 5_000_000:
        raise ValueError('Feed exceeds 5 MB limit')
    root = ET.fromstring(raw)
    for node in root.iter():
        if node.tag.rsplit('}', 1)[-1] not in ('item', 'entry'):
            continue
        data = {child.tag.rsplit('}', 1)[-1]: child.text or '' for child in node}
        link = data.get('link', '')
        for child in node:
            if child.tag.rsplit('}', 1)[-1] == 'link' and child.get('rel', 'alternate') == 'alternate':
                link = child.get('href') or link
        summary = html_record(data.get('description') or data.get('summary') or data.get('content') or data.get('encoded') or '')['body']
        yield {'publisher': source['publisher'], 'title': data.get('title', ''),
               'canonical_url': link, 'published_at': data.get('pubDate') or data.get('published') or data.get('date', ''),
               'body': summary, 'body_scope': 'rss_excerpt', 'retrieval_method': 'official_rss',
               'source_reviewed': False}


def run(inbox, output, start=None, end=None, config=None):
    records, errors, duplicates, excluded, uncertain = [], [], [], [], []
    if start and end and start > end:
        raise ValueError('Start is later than end')
    paths = [p for p in sorted(inbox.iterdir()) if p.is_file() and not p.name.endswith('.meta.json')]
    for path in paths:
        try:
            records.append(prepare(import_file(path)))
        except Exception as error:
            errors.append({'source': path.name, 'error': str(error)})
    for source in (config or {}).get('feeds', []):
        if not source.get('enabled'):
            continue
        try:
            records.extend(prepare(record) for record in read_feed(source))
        except Exception as error:
            errors.append({'source': source.get('publisher', ''), 'error': str(error)})
    articles, seen = [], set()
    for record in records:
        date = publication_date(record['published_at'])
        if (start or end) and not date:
            uncertain.append(record)
            continue
        if date and ((start and date < start) or (end and date >= end)):
            excluded.append(record)
            continue
        if not record['company_mentions']:
            continue
        key = record['canonical_url'] or record['content_sha256']
        if key in seen:
            duplicates.append(record)
            continue
        seen.add(key)
        articles.append(record)
    output.mkdir(parents=True, exist_ok=True)
    result = {'articles': articles, 'uncertain_dates': uncertain, 'errors': errors,
              'duplicates': duplicates, 'outside_window': excluded,
              'coverage_complete': False}
    (output / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    lines = ['# Собранные материалы', '', 'Это проверка сбора, не полный выпуск мониторинга.', '']
    for record in articles:
        lines.extend([f"**{record['publisher']}** — {record['title']}", record['canonical_url'],
                      f"Дата: {record['published_at']}",
                      'Упоминания: ' + ', '.join(m['company'] for m in record['company_mentions']),
                      'Спикеры с подтверждающей цитатой: ' + ', '.join(s['name'] for s in record['verified_speakers']),
                      'Статус: ' + record['verification_status'], ''])
    (output / 'report.md').write_text('\n'.join(lines), encoding='utf-8')
    return result


def main():
    home = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser()
    parser.add_argument('--inbox', type=Path, default=home / 'inbox')
    parser.add_argument('--output', type=Path, default=home / 'results')
    parser.add_argument('--config', type=Path, default=home / 'sources.json')
    parser.add_argument('--start', help='Inclusive ISO datetime, timezone required')
    parser.add_argument('--end', help='Exclusive ISO datetime, timezone required')
    args = parser.parse_args()
    start, end = publication_date(args.start), publication_date(args.end)
    if (args.start and not start) or (args.end and not end):
        parser.error('Dates must include time and UTC offset, e.g. 2026-10-26T11:00:00+03:00')
    config = json.loads(args.config.read_text()) if args.config.exists() else {}
    args.inbox.mkdir(parents=True, exist_ok=True)
    result = run(args.inbox, args.output, start, end, config)
    print(json.dumps({k:len(result[k]) for k in ('articles','uncertain_dates','errors','duplicates','outside_window')}, ensure_ascii=False))
    print(args.output)
    return 2 if result['errors'] else 0


if __name__ == '__main__':
    sys.exit(main())
