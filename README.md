# World Mobile Stratospheric — Investor Data Room Gateway

A standalone, static landing page that gates access to the WMS investor data room.
Investors arrive from [wmstratospheric.com](https://wmstratospheric.com), read a short
high-trust pitch, and complete an embedded form to request access.

The branding (Aeonik typeface, `#0A0A0A` near-black base, `#FFF533` electric-yellow accent,
full-pill buttons, 40px cards, logo + favicons) is matched directly to the live site.

## Stack

Pure static — **HTML + CSS + vanilla JS**, no build step, no dependencies. Designed for
**Cloudflare Pages**.

```
index.html               # markup + meta/OG
assets/css/styles.css    # brand tokens, layout, components, motion
assets/js/main.js        # smooth-scroll, reveal-on-scroll, count-up, gauge
assets/fonts/            # Aeonik woff2 (Light/Regular/Medium/Bold)
assets/img/              # logo + favicon set
_headers                 # Cloudflare Pages caching + security headers
```

## 1. Investor form (already wired)

The **Microsoft Forms** "Investor Data Room Access" form is embedded via an `<iframe>` in the
`#form-embed` slot in `index.html`. CSS (`.form-embed iframe`) makes it full-width and on-brand
at a 720px height (edit in `styles.css` if your form is longer/shorter). A `<noscript>` fallback
links straight to the form if JS/iframes are blocked.

To swap forms later, replace the `<iframe>` inside `#form-embed` and update the host in `_headers`
(see below). Form height is controlled by `--form-h` on `.form-embed` in `styles.css` — it's sized
so the whole form (incl. **Submit**) shows without a nested scrollbar; adjust if you add questions.

**Mobile:** Microsoft Forms refuses to render inline below ~640px wide (it shows an off-brand teal
"Fill out the form" card). So at ≤700px the iframe is hidden and a branded **"Open access form"**
CTA (`.form-fallback`) is shown instead, which opens the form directly. Desktop/tablet get the
inline form. Nothing to configure — it's automatic.

> **Theme tip:** the form's internal colours (currently the default orange header) are set inside
> Microsoft Forms, not here. In Forms → **Style/Theme**, pick a dark/black theme to match the
> page's black + yellow branding for a seamless look.

## 2. Form host is whitelisted (CSP)

`_headers` already ships an active `Content-Security-Policy` locking `frame-src` to
`forms.cloud.microsoft` + `forms.office.com`. If you change form providers, update that directive.

> If this whole page will itself be embedded inside `wmstratospheric.com`, also update
> `frame-ancestors` as noted in `_headers`.

## 3. Basic Auth (password gate)

The whole site sits behind HTTP Basic Auth via a Pages Function
(`functions/_middleware.js`). It **fails closed** — until credentials are set,
every request returns 503, so the site is never accidentally public.

Set the credentials in the Pages dashboard (do **not** commit them):

**Pages project → Settings → Environment variables** — add to both
**Production** and **Preview**:

| Variable              | Value                    | Type             |
| --------------------- | ------------------------ | ---------------- |
| `BASIC_AUTH_USERNAME` | your chosen username     | Plaintext        |
| `BASIC_AUTH_PASSWORD` | your chosen password     | **Encrypt** (secret) |

Then redeploy. Visitors get a browser username/password prompt before the page
loads. To rotate credentials, edit the env vars and redeploy — no code change.

> Credentials are **shared** across all investors. For per-investor email login
> (one-time PIN, audit log), use Cloudflare Access (Zero Trust) instead — that's
> dashboard-only and needs no repo code.

## 4. Deploy to Cloudflare Pages

**Option A — Wrangler (CLI), from this directory:**

```bash
npx wrangler pages deploy . --project-name wms-investor
```

(First run prompts a Cloudflare login. Re-run the same command to publish updates.)

**Option B — Dashboard (drag & drop):**
Cloudflare dash → **Workers & Pages** → **Create** → **Pages** → **Upload assets** →
drag this folder in → **Deploy**.

**Option C — Git integration:**
Push this folder to a Git repo and connect it in Pages. Build settings:
**Framework preset = None**, **Build command = (empty)**, **Output directory = `/`**.

### Custom domain
In the Pages project → **Custom domains** → add e.g. `invest.wmstratospheric.com`
(or `data.wmstratospheric.com`) and follow the DNS prompt.

## Local preview

```bash
npx wrangler pages dev .
# or any static server:
python3 -m http.server 8080
```

Open the printed URL.

## Notes

- `<meta name="robots" content="noindex, nofollow">` keeps this private gateway out of
  search indexes. Remove it if you want it indexed.
- The footer carries a placeholder securities/confidentiality disclaimer naming the legal
  entity **Combined Space Technology Ltd**. **Have your counsel review this wording before
  launch.**
- Fully responsive, keyboard-accessible, and respects `prefers-reduced-motion`.
