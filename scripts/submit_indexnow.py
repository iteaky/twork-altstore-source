#!/usr/bin/env python3
"""IndexNow: validate canonical project URLs, then notify after Pages deployment."""
import argparse
import json
from pathlib import Path
from urllib import request, parse, error
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://iteaky.github.io/twork-altstore-source/"
KEY = "5d041d250abd4aed8860868e17ea73d8"
KEY_LOCATION = BASE + KEY + ".txt"
HOST = "iteaky.github.io"
SITEMAP = BASE + "sitemap.xml"
ENDPOINT = "https://api.indexnow.org/indexnow"

def urls_from_xml(xml):
    root = ElementTree.fromstring(xml)
    urls = [(item.text or "").strip() for item in root.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    if not urls or len(urls) > 10000 or len(urls) != len(set(urls)):
        raise ValueError("Sitemap is empty, duplicated or exceeds the IndexNow limit")
    for url in urls:
        parsed = parse.urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != HOST or not parsed.path.startswith("/twork-altstore-source/") or parsed.query or parsed.fragment:
            raise ValueError("URL outside verified GitHub Pages project: " + url)
    return urls

def get_live(url):
    req = request.Request(url, headers={"User-Agent": "TWORK-IndexNow/1.0"})
    with request.urlopen(req, timeout=25) as response:
        if response.status != 200:
            raise RuntimeError("Unexpected HTTP status " + str(response.status))
        return response.read()

def main():
    args = argparse.ArgumentParser(description="Submit canonical URLs via IndexNow")
    modes = args.add_mutually_exclusive_group(required=True)
    modes.add_argument("--dry-run", action="store_true")
    modes.add_argument("--submit", action="store_true")
    opts = args.parse_args()
    if (ROOT / (KEY + ".txt")).read_text(encoding="utf-8").strip() != KEY:
        raise ValueError("Local key verification failed")
    urls = urls_from_xml((ROOT / "sitemap.xml").read_bytes())
    print("Validated", len(urls), "canonical URLs, key at", KEY_LOCATION)
    if opts.dry_run:
        print("Dry run only: nothing was sent.")
        return
    if get_live(KEY_LOCATION).decode("utf-8").strip() != KEY:
        raise RuntimeError("The public GitHub Pages verification key has not deployed")
    if set(urls_from_xml(get_live(SITEMAP))) != set(urls):
        raise RuntimeError("Live sitemap has not deployed yet")
    payload = {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    data = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    req = request.Request(ENDPOINT, data=data, method="POST", headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with request.urlopen(req, timeout=30) as response:
            code = response.status
            print("IndexNow response:", code)
    except error.HTTPError as ex:
        raise RuntimeError("IndexNow rejected submission: HTTP " + str(ex.code)) from ex
    if code not in (200, 202):
        raise RuntimeError("Unexpected IndexNow response: " + str(code))
    print("URL notification accepted/pending verification; indexing is not guaranteed.")

if __name__ == "__main__":
    main()
