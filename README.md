# getmaybelater.app

Marketing + legal website for the **Maybe Later** Android app. It's a fast,
dependency-free static site (plain HTML + one CSS file + a few KB of JS) built to
be hosted on **GitHub Pages** at the apex domain **getmaybelater.app**.

## Structure

```
.
├── index.html          Landing / upsell page
├── privacy.html        Privacy Policy  (required for the Play Store listing)
├── terms.html          Terms of Service
├── support.html        Support / contact (use as the Play "support URL")
├── 404.html            Friendly not-found page (served by GitHub Pages)
├── robots.txt          Allows indexing, points to the sitemap
├── sitemap.xml         Sitemap for search engines
├── .nojekyll           Serve files as-is (skip Jekyll processing)
└── assets/
    ├── css/styles.css  Design system + all styles (edit tokens in :root to re-skin)
    ├── js/main.js      Mobile nav + footer year (progressive enhancement only)
    └── img/            logo.svg, favicon.svg, og-image.svg
```

No build step, no framework, no external requests — every page is self-contained
and loads a single small stylesheet and script. To preview locally:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

> Asset/link paths are **root-absolute** (`/assets/...`) because the site is
> meant to live at the apex domain root. Preview locally as above (served from
> the repo root) rather than via the raw project-page URL.

## ✅ Before you publish — content checklist

The landing page, FAQ, and Privacy Policy are written to the app's real feature
set. A few things still need your input before going live:

- [ ] **Google Play link** — the app isn't published yet, so buttons show
      *"Coming soon"*. When the listing is live, find/replace the token
      `PLAYSTORE_URL` in every `.html` file with the real URL, and delete the
      `aria-disabled="true"` attribute on those links/badges.
- [ ] **Contact emails** — replace `privacy@getmaybelater.app` /
      `support@getmaybelater.app` with monitored addresses (Google Play requires
      a working contact). Until domain email is set up, point these at any inbox
      you check.
- [ ] **Terms** (`terms.html`) — set the pricing model (§4), governing-law
      jurisdiction (§8), and the "Last updated" date.
- [ ] **Analytics disclosure (decision)** — the app currently has **no in-app
      analytics opt-out**, so `privacy.html` §2.2/§9 state that Firebase
      Analytics/Crashlytics run automatically. If you add a consent/opt-out
      control (recommended for GDPR/CCPA markets), soften that wording to match.
- [ ] **Support reply time** — set the expected turnaround in `support.html`
      (currently `[2–3 business days]`).
- [ ] **OG image (optional)** — `assets/img/og-image.svg` works, but some social
      platforms only render raster images. Optionally export a 1200×630 **PNG**
      and update the `og:image` URLs.

> The Privacy Policy reflects the app's data practices as described, but it is
> not legal advice — have it reviewed if you operate in regulated markets.

## 🚀 Publishing to GitHub Pages

1. **Merge this to `main`.** GitHub Pages publishes from a branch, so get these
   files onto your default branch first.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
5. Wait ~1 minute. Your site goes live at
   `https://<your-username>.github.io/getmaybelater.app/`.
   (CSS/JS use absolute paths for the apex domain, so styling is only fully
   correct once the custom domain below is attached — the content is all there
   regardless.)

## 🌐 Custom domain (getmaybelater.app)

Once you've purchased the domain:

1. **Settings → Pages → Custom domain** → enter `getmaybelater.app` → **Save**.
   (This creates a `CNAME` file in the repo — leave it in place.)
2. At your DNS provider, point the **apex** domain at GitHub Pages with four
   `A` records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   (and optionally the matching `AAAA` records for IPv6). To also serve
   `www.getmaybelater.app`, add a `CNAME` record for `www` →
   `<your-username>.github.io`.
3. Back in **Settings → Pages**, wait for the DNS check to pass, then tick
   **Enforce HTTPS**. GitHub provisions the TLS certificate automatically.

Full reference: <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>
