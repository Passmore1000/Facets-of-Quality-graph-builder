# Open Source Checklist

Use this before or right after making the repository public.

## 1) Core docs and metadata

- `README.md` is project-specific (not template text)
- Demo link points to your live Vercel site
- `LICENSE` exists (MIT in this repo)
- `package.json` has correct `repository`, `bugs`, and `homepage` URLs

## 2) Remove private/sensitive data

- No `.env` files committed
- No API keys or access tokens
- No private/internal URLs that should stay private
- No hardcoded secrets in source code
- No secrets in commit history

## 3) GitHub repository polish

- Add a short project description in the repo About section
- Add website URL (Vercel domain) in About section
- Add useful topics, for example:
  - `react`
  - `typescript`
  - `vite`
  - `d3`
  - `data-visualization`
  - `design-tool`

## 4) Optional but polished

- Add one screenshot or GIF to `README.md`
- Add GitHub social preview image
- Keep `CONTRIBUTING.md` lightweight and clear

## 5) Maintenance expectations

If this is a low-maintenance side project, state it clearly in `README.md`:

- "No guaranteed roadmap"
- "PRs reviewed as time allows"
- "Forks welcome"
