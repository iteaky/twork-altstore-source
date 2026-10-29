# TWORK Website Analytics: GA4 + Clarity (opt-in)

This integration is **ready for credentials**, but no external data is transmitted while `analytics/config.js` contains empty project identifiers.

## How to activate
1. Create a Google Analytics 4 property with a Web data stream for **https://iteaky.github.io/twork-altstore-source/** at https://analytics.google.com/ .
2. Copy the stream's **Measurement ID** (starts with `G-`); enter it into `analytics/config.js` as `ga4MeasurementId`.
3. Create a Microsoft Clarity project for the same site at https://clarity.microsoft.com/ ; enter the public **Project ID** as `clarityProjectId`. In Clarity project Settings, enable **Consent Mode** and use **Strict masking** (recommended). Do not add user identification or unmask form areas.
4. Deploy the site. Test with a browser whose localStorage has no saved consent, click Reject and verify no requests to `googletagmanager.com` or `clarity.ms`. Accept and verify provider requests appear. Verify in GA4 Realtime and Clarity dashboard using your own opted-in visit.
5. In GA4 Admin, disable Google signals / personalized advertising where available, set appropriate data retention, set `generate_lead` as a key event **only after confirming actual redirects occur on successful submissions**, disable unnecessary enhanced-measurement form/event tracking, and add test/internal traffic filtering as needed.
6. Note privacy notice and data-processing settings. The site owner is responsible for verifying vendor agreements, consent language and retention / cross-border-transfer disclosures applicable to their business.

## What will be available
- GA4: page views, daily/weekly/monthly visits, device/country-level metrics, referral origins, UTM campaigns, returning visitor estimates, and event names listed below.
- Clarity (separately enabled by the visitor): click/scroll heatmaps and masked session replays. This is not a live video camera feed. Clarity gives pseudonymous session/user identifiers, **not names or identities**.
- No login-based individual recognition. The script never uses email/phone, text-field values, or visitor-entered names as analytics parameters.
- Exact personal identities, raw user IP lists or details of visitors who refuse tracking are not available through this implementation.
- Since the site runs on GitHub Pages, the dashboard is hosted by GA4/Clarity, **not** by GitHub.

## Custom GA4 events
| Event | Meaning |
|---|---|
| `page_view` | Sanitized path, page title, origin-only referrer; approved UTM params only |
| `early_access_click` | Click on any CTA with `.js-access`, segmented by area |
| `android_interest_click` | Interest in Android (if that CTA is rendered) |
| `lead_form_start` | First focus of the early-access form, no field values |
| `lead_submit_attempt` | Signup form submission requested (NOT a confirmed conversion) |
| `generate_lead` | Confirmation page `?access=sent` reached after consent |
| `navigation_click` | Sanitized destination pathname or outside domain, no URL query |
| `interface_click` | Other button interactions, categorised by page area |
| `language_change` | Locale selected through the existing language switcher |
| `scroll_depth` | 50% and 90% scrolling reached |

The actual form result must be verified independently: `lead_submit_attempt` is not proof of email delivery.

## Consent and privacy design
- **Basic Consent Mode**: neither GA4 nor Clarity loads before opt-in. Google advertising consent remains denied. Clarity receives `consentv2` with ad storage denied and analytics granted only after separate replay approval.
- Visitors can reject all, accept all, or enable statistics without replay. Choice is stored in first-party localStorage (not available to the owner).
- The persistent privacy settings control lets visitors withdraw. When withdrawing consent, the script updates consent signals and reloads so tracking scripts are fully absent on subsequent page load.
- Microsoft masks sensitive form inputs by default; the script also adds `data-clarity-mask` to forms. For pages with unrecognized URL query parameters, Clarity is intentionally not loaded.
- No tracking identifiers / developer secrets go in repository. The Google Measurement ID and Clarity Project ID are **public** and not security tokens; do not put service API secrets in JS.
- Root URL query strings may contain visitor-supplied data, therefore GA4 page locations strip unknown params, and Clarity recording is blocked on sensitive/unknown queries. Avoid placing names or emails in paths, referrers, or UTM parameters.
- Browser ad blockers may prevent measurement. Results represent **consenting, measurable traffic**, not every person who visited.
- Cookie banner translations are Russian, English and Slovak; other installed UI languages receive English text as fallback.

## Run QA
```bash
npm install
npx playwright test --config=playwright.config.cjs tests/website-analytics.spec.mjs
python3 scripts/check_seo.py
```

## GitHub Pages
Analytics must be included on all public HTML entry points; use page-relative local script URLs. Configuration is in `analytics/config.js`. Merging an SEO PR does not itself activate measurement — the identifiers must be configured and a visitor must consent.

## Useful dashboard views
- GA4 Reports → Acquisition → Traffic acquisition for organic/AI/UTM referral sources.
- GA4 Reports → Engagement → Events for CTA clicks and forms. Configure a funnel: page_view → early_access_click → lead_form_start → lead_submit_attempt → generate_lead.
- Clarity → Heatmaps and Recordings to see opt-in user behavior, friction and scroll patterns.
