# TWORK technical SEO & AI-discovery setup

Public host: https://iteaky.github.io/twork-altstore-source/

## Implemented
- Descriptive human-readable Russian homepage and static English/Slovak overview URLs.
- Six distinct feature explanations with self-canonical English and Russian pages, reciprocal hreflang and internal links.
- Plain HTML for search and AI crawlers: no client JS required to read these pages.
- SoftwareApplication, Organization and WebSite JSON-LD on homepages; WebPage + BreadcrumbList on feature articles.
- XML sitemap with multilingual alternate links, plus readable `llms.txt` as optional documentation (not a ranking mechanism).
- Existing early-access form and beta distribution details remain intact. No unverified pricing, reviews or App Store URLs.

## Deployment and verification — actions requiring site owner access
1. **Confirm GitHub Pages is enabled** under repository Settings → Pages. Publish the branch `main`, folder `/(root)`, or use an authorized deployment workflow. PR pages are not live until merge and deployment. Check live status with `curl -IL https://iteaky.github.io/twork-altstore-source/` (expect 200) after deployment.
2. **Google Search Console:** verify the site ownership (GitHub Pages URL-prefix property if appropriate) and submit `https://iteaky.github.io/twork-altstore-source/sitemap.xml`. Request inspection of homepage and two feature URLs.
3. **Bing Webmaster Tools:** verify the same property and submit the sitemap. Bing indexing and AI citation metrics may become available with data.
4. **AI search crawling:** access is controlled by the **hostname root** `https://iteaky.github.io/robots.txt`, not a `/twork-altstore-source/robots.txt` file. This GitHub Pages project cannot override the shared github.io host root. If direct robots policy control (e.g., OAI-SearchBot) becomes important, use a custom domain and place `robots.txt` at that domain's root.
5. **Custom domain** (optional): if/when bought, update all canonical, hreflang, OG, JSON-LD, sitemap, contact form redirect, AltStore website and links together. Never add an unverified domain to current canonical metadata.
6. **Off-site authority:** publish real product information on relevant trainer/coach software directories and product launch pages; do not fabricate user reviews, awards or competitor comparisons.
7. **Measurement:** track indexing and referrals; manually sample English, Russian and Slovak questions in ChatGPT, Gemini, Copilot and Perplexity. Inclusion in answers cannot be guaranteed.

## Run checks locally
```bash
python3 scripts/check_seo.py
npm ci
npm test
```

Note: `npm ci` may require a lockfile. If unavailable, run `npm install` before the Playwright suite. SEO checks have no external dependencies.

## Indexing status
The site was not reachable through the inspection tool on 2026-10-29. This is an unconfirmed crawler/network observation, not proof of GitHub Pages misconfiguration or a live 404. Do not claim Search Console verification or index coverage until separately observed.
