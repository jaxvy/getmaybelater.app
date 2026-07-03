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

No build step and no framework — every page is a self-contained HTML file that
loads a single small stylesheet, a few KB of JS, and the web fonts (Space
Grotesk, Inter, JetBrains Mono) from Google Fonts to match the app's type. To
preview locally:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

> Asset/link paths are **root-absolute** (`/assets/...`) because the site is
> meant to live at the apex domain root. Preview locally as above (served from
> the repo root) rather than via the raw project-page URL.

## Content status

The landing page, FAQ, Privacy Policy, and Terms of Use are written to the app's
real feature set and to the current reality: **MaybeLater is a free app made by
one independent developer** (no company), with all contact routed to
`jaxvy@yahoo.com`. The legal pages are written conservatively to disclaim
warranties and limit liability to the maximum extent the law allows.

The one remaining placeholder is the **Google Play link**: the app isn't
published yet, so the download buttons show *"Coming soon"*. When the listing is
live, find/replace the token `PLAYSTORE_URL` in every `.html` file with the real
URL and delete the `aria-disabled="true"` attribute on those links/badges.

> The Privacy Policy and Terms reflect the app's practices in good faith but are
> not legal advice — have them reviewed if you operate in regulated markets.

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
