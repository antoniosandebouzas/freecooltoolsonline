# FreeCoolToolsOnline 🚀

**Toni's free cool tools you can use online.** A small Jekyll-based site (using the Minima theme) that hosts simple utilities, articles and demos. The site source lives in the `docs/` directory and is configured to build with Jekyll and Bundler.

---

## 📌 Quick summary

- Static site built with Jekyll using the **Minima** theme
- Content and site configuration live in `docs/` (`docs/_config.yml`, `docs/pages/`, `docs/assets/`)
- License: **GNU AGPL v3** (see `LICENSE`) ⚖️
- Author / maintainer: **Toni** — toni@freecooltoolsonline.com

---

## ✅ Features

- Lightweight blog / tools site powered by Jekyll and Minima
- Theme-ready structure with layouts, includes and SASS skins
- SEO and feed support via recommended plugins (`jekyll-seo-tag`, `jekyll-feed`)
- Easy local development and GitHub Pages friendly (serve from `docs/`)

---

## 🔧 Quick start (local development)

Requirements:
- Ruby (2.7+ recommended)
- Bundler
- Git

Steps:

1. Clone the repo:

```bash
git clone <repo-url> && cd freecooltoolsonline
```

2. Install dependencies (from the `docs/` folder):

```bash
cd docs
bundle install
```

3. Serve locally (auto-regenerates on changes):

```bash
bundle exec jekyll serve --livereload
# Visit http://127.0.0.1:4000
```

Notes:
- If you encounter Ruby version issues, use a Ruby version manager such as `rbenv` or `rvm`.
- `Gemfile` in `docs/` controls the site gems and Jekyll version.

---

## 📦 Build & Deploy

This project can be deployed via GitHub Pages (recommended for simplicity) or any static host (Netlify, Vercel, etc.).

GitHub Pages (serve `docs/`):
- In repository settings → Pages, set the source to the `docs/` folder on the `main` branch.
- Or use a GitHub Actions workflow to build and publish a site to `gh-pages` branch if you need more control or CI builds.

Manual build:

```bash
cd docs
bundle exec jekyll build -d _site
# Upload the generated _site/ folder to your static host
```

---

## 📁 Project structure (high level)

- `docs/` — Jekyll site source (layouts, pages, assets and `_config.yml`)
  - `docs/pages/` — content pages (about, tools, posts)
  - `docs/_layouts`, `docs/_includes`, `docs/_sass` — theme and styling
  - `docs/Gemfile` — site gem dependencies
- `tfm/`, `wd/` — supporting project folders (docs, scripts)
- `LICENSE` — project license (GNU AGPL v3)

---

## 🤝 Contributing

Contributions are welcome. A suggested workflow:

1. Fork the repository
2. Create a branch for your feature/fix
3. Update or add pages under `docs/pages/` and commit changes
4. Open a pull request with a short description of the change

Please respect the license (AGPL-3.0) and keep changes small and focused.

---

## 📜 Changelog & History

See `docs/History.markdown` for a project history and release notes.

---

## 📬 Contact

Toni — toni@freecooltoolsonline.com

---

If you want, I can also add a GitHub Actions CI workflow to build and deploy the site automatically — tell me which provider you prefer (GitHub Pages, Netlify, or Vercel). 💡