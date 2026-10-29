#!/usr/bin/env python3
"""Offline SEO/structured-data consistency checks for GitHub Pages."""
import html.parser
import json
from pathlib import Path
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://iteaky.github.io/twork-altstore-source/"
URLS = [BASE, BASE + "en/", BASE + "sk/"]
SLUGS = ["personal-trainer-crm","training-schedule","subscriptions-and-payments","apple-calendar","club-finances","online-training-timezones"]
for slug in SLUGS:
    URLS.extend((BASE + "features/" + slug + "/", BASE + "ru/features/" + slug + "/"))
URLS.extend((BASE + "support/", BASE + "privacy/"))

def local_path(url):
    if not url.startswith(BASE):
        return None
    relative = unquote(url[len(BASE):])
    if relative.endswith("/") or not relative:
        relative += "index.html"
    return ROOT / relative

class AuditHTML(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.links = []
        self.titles = []
        self.h1 = 0
        self.jsonld = []
        self.in_jsonld = False
        self.lang = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "meta" and ("name" in a or "property" in a):
            self.meta[a.get("name") or a.get("property")] = a.get("content")
        if tag == "link":
            self.links.append(a)
        if tag == "a":
            href = a.get("href", "")
            if href.startswith(BASE):
                dest = local_path(href.split("#", 1)[0])
                assert dest.is_file(), f"Broken site link: {href}"
        if tag == "title":
            self.titles.append("")
        if tag == "h1":
            self.h1 += 1
        if tag == "script" and a.get("type") == "application/ld+json":
            self.in_jsonld = True
            self.jsonld.append("")
    def handle_endtag(self, tag):
        if tag == "script":
            self.in_jsonld = False
    def handle_data(self, data):
        if self.in_jsonld:
            self.jsonld[-1] += data

def main():
    urls_in_xml = [el.text for el in ET.parse(ROOT / "sitemap.xml").iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert set(urls_in_xml) == set(URLS), (len(urls_in_xml), len(URLS), set(URLS) - set(urls_in_xml))
    assert len(urls_in_xml) == len(set(urls_in_xml))
    for url in URLS:
        page = local_path(url)
        assert page.is_file(), f"Missing sitemap target: {url}"
        p = AuditHTML()
        p.feed(page.read_text(encoding="utf-8"))
        assert p.lang in ("ru", "en", "sk"), page
        assert p.meta.get("description") and len(p.meta["description"]) >= 55, page
        assert p.h1 == 1, (page, p.h1)
        assert any(l.get("rel") == "canonical" and l.get("href") == url for l in p.links), page
        if url not in (BASE + "support/", BASE + "privacy/"):
            assert p.jsonld, page
            for script in p.jsonld:
                data = json.loads(script)
                assert data.get("@context") == "https://schema.org", page
        for link in p.links:
            if link.get("rel") == "alternate" and link.get("hreflang"):
                other = link.get("href", "")
                assert other in URLS, (page, other)
        print("OK", p.lang, url)
    print("All", len(URLS), "canonical HTML pages validated; sitemap and JSON-LD parse successfully.")

if __name__ == "__main__":
    main()
