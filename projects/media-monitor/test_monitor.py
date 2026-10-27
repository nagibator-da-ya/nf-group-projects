import json
import tempfile
import unittest
from pathlib import Path
from monitor import company_matches, html_record, permitted, prepare, publication_date, run


class MonitorTests(unittest.TestCase):
    def test_company_boundaries_and_exclusion(self):
        self.assertEqual(company_matches('Метриум расширяется; CMWPartners'), [])
        names = {m['company'] for m in company_matches('NF\u00a0Group; Метриум Премиум; CORE.XP; NF PM')}
        self.assertEqual(names, {'NF GROUP','Метриум Премиум','CORE.XP','NF PM'})

    def test_no_script_or_navigation_mentions(self):
        record = html_record('<title>T</title><nav>NF GROUP</nav><article><p>Nikoliers</p><script>NF PM</script></article>')
        self.assertEqual([m['company'] for m in company_matches(record['body'])], ['Nikoliers'])

    def test_rss_is_never_verified(self):
        record = prepare({'body':'NF GROUP','body_scope':'rss_excerpt','source_reviewed':True})
        self.assertEqual(record['verification_status'], 'needs_article_review')

    def test_unproven_speaker_is_rejected(self):
        record = prepare({'body':'NF GROUP','speakers':[{'name':'Иван','evidence':'Иван из NF GROUP'}]})
        self.assertEqual(record['verified_speakers'], [])

    def test_dates_require_timezone(self):
        self.assertIsNone(publication_date('2026-10-27T08:30:00'))
        self.assertIsNotNone(publication_date('Tue, 27 Oct 2026 08:30:00 +0300'))

    def test_explicit_denials_not_routed_through_http(self):
        for host in ['realty.ria.ru','rg.ru','iz.ru','tass.ru','lenta.ru','dzen.ru']:
            with self.assertRaises(ValueError):
                permitted('https://' + host + '/rss', [host])

    def test_pipeline_window_dedup_and_bad_file(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            inbox = base/'inbox'
            inbox.mkdir()
            record = {'publisher':'test','title':'test','body':'NF GROUP',
                      'canonical_url':'https://example.org/article?utm_source=x',
                      'published_at':'2026-10-27T08:30:00+03:00'}
            for name in ('one','duplicate'):
                (inbox/f'{name}.json').write_text(json.dumps(record))
            unknown = dict(record, published_at='')
            (inbox/'unknown.json').write_text(json.dumps(unknown))
            (inbox/'bad.json').write_text('{')
            result = run(inbox, base/'out', publication_date('2026-10-26T11:00:00+03:00'), publication_date('2026-10-27T11:00:00+03:00'))
            self.assertEqual(len(result['articles']),1)
            self.assertEqual(len(result['duplicates']),1)
            self.assertEqual(len(result['uncertain_dates']),1)
            self.assertEqual(len(result['errors']),1)
            self.assertEqual(result['articles'][0]['canonical_url'],'https://example.org/article')


if __name__ == '__main__':
    unittest.main()
