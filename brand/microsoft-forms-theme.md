# Matching the Microsoft Form to the brand

Microsoft Forms only lets you customise a **theme colour (hex)** and a **background image** —
it can't make the form body dark. These two settings remove the default orange and blend the
form into the page's black + yellow aesthetic.

## Files in this folder
- `microsoft-forms-background.jpg` — branded "edge of space" background (3840×2160, ~0.6 MB),
  matched to the landing-page hero. Upload this as the form's custom background image.

## Steps (Microsoft Forms)
1. Open the **Investor Data Room Access** form.
2. Top-right → **Style** (the paint-roller / "Theme" button).
3. Scroll the theme strip to the end → click **＋ / Customize theme** (custom theme).
4. **Background image:** upload `microsoft-forms-background.jpg`.
5. **Colour:** choose **Custom colour** and paste the hex below.
6. Save. Reload the landing page — the embedded form now reads black with white text.

## Recommended theme colour
```
#0A0A0A
```
This is the brand near-black. It turns the form header band and the **Submit** button black
with readable white text — no more orange.

> **Why not yellow (`#FFF533`) as the theme colour?** Forms uses the theme colour as the
> Submit-button fill with white label text — yellow + white is unreadable. Keep the theme
> colour black; the yellow accents live on the surrounding page. (The background image already
> carries the yellow horizon line as the brand pop.)

## Notes
- Forms accepts JPG/PNG up to ~4 MB — this image is well under.
- The question cards stay light/white (Forms can't darken them); against the page's dark form
  card this reads as a clean inset document panel.
- This image is **not** part of the deployed website — it lives here only for upload to Forms.
