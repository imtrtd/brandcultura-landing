# Cloudflare Pages deployment

The site is fully static (single page, no API routes, server actions,
middleware or dynamic rendering), so it is built with Next.js **static export**
(`output: 'export'` in `next.config.mjs`) and served by **Cloudflare Pages**
as plain files. No `@cloudflare/next-on-pages` (deprecated) or OpenNext needed.

## Commands

```bash
pnpm install
pnpm pages:build     # next build -> ./out
pnpm pages:preview   # serve ./out locally with wrangler (http://localhost:8788)
pnpm pages:deploy    # wrangler pages deploy out --project-name brandcultura
```

`pages:deploy` needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the
environment. Pass `--branch <name>` to make a preview deployment instead of
production.

- Pages project: `brandcultura` (Direct Upload) -> https://brandcultura.pages.dev
- `wrangler.toml`: `pages_build_output_dir = "out"`
- `public/_headers`: long-lived cache for `/_next/static/*`
- CI: `.github/workflows/cloudflare-pages.yml` deploys on push to `main`
  once repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are
  set (it skips with a warning otherwise).

## Vercel compatibility

Vercel supports Next static exports, so the existing Vercel project keeps
building. `@vercel/analytics` is only rendered when `VERCEL=1` (set
automatically on Vercel builds), because `/_vercel/insights` does not exist on
Cloudflare. For analytics on Cloudflare, enable **Cloudflare Web Analytics** on
the Pages project (Dashboard -> Workers & Pages -> brandcultura -> Metrics ->
Web Analytics), which injects its beacon automatically; no code change needed.

Note: the contact form is client-only (it shows a "thanks" state and sends
nothing), on Vercel and Cloudflare alike.

## Custom domains (not applied yet)

1. Add `brandcultura.art` and `brandcultura.agency` as zones in the Cloudflare
   account and switch nameservers at the registrar to the ones Cloudflare
   assigns. Recreate any mail records (MX/TXT) first.
2. Pages project `brandcultura` -> Custom domains -> add `brandcultura.art`
   and `www.brandcultura.art`.
3. Remove the domains from the Vercel project once Cloudflare serves them.

## Domain redirect (.agency -> .art)

Pages `_redirects` only matches paths, not hostnames, so it can't do this.
Once `brandcultura.agency` is a Cloudflare zone:

- Add proxied DNS records so the zone has traffic to act on, e.g.
  `A @ 192.0.2.1` and `A www 192.0.2.1` (proxied, orange cloud).
- Rules -> Redirect Rules -> "Redirect from root to WWW"-style custom rule:
  when `http.host in {"brandcultura.agency" "www.brandcultura.agency"}`
  -> dynamic redirect to
  `concat("https://brandcultura.art", http.request.uri.path)`, status 301,
  preserve query string.
- Do the same for `www.brandcultura.art` -> `brandcultura.art` in that zone
  (or attach `www` as a Pages custom domain too).

(Alternative: account-level Bulk Redirects with a list entry
`brandcultura.agency` -> `https://brandcultura.art`, subpath matching +
preserve path suffix.)
