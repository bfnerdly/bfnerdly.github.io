# bfnerdly.github.io

Personal site of Brandon Fricker, PhD: <https://bfnerdly.github.io>

Plain Jekyll, built by GitHub Pages from `main`. No theme: layouts, includes and CSS all live here.

## Common edits

| To change… | Edit |
|---|---|
| Name, email, social links, "open to roles" line, résumé link | `_config.yml` |
| Top navigation | `_data/navigation.yml` (Contact is the header button) |
| The four map regions (names, colors, positions on the map) | `_data/clusters.yml` |
| Home page sections, evidence lists, Fig. 2 readout | `index.html` |
| About / Projects / Contact / EthoCrypt | `about.html`, `projects/index.html`, `contact.html`, `projects/ethocrypt.html` |
| Closing "email me" band on every page | `_includes/close.html` |
| Featured papers, summaries, cluster tags, equal-contribution marks | `_data/publication_overrides.yml` |
| Colors, type, layout | `assets/css/main.css` (one magma colormap; tokens at the top) |
| The animated map | `assets/js/behavior-map.js` (no-JS fallbacks: `assets/images/map-fallback*.jpg`) |
| Inner-page dot graphic | `python3 tools/make_dots.py` regenerates `_includes/dots.html` |

Design decisions and their reasons live in `PRODUCT.md` and `DESIGN.md` (neither is published on the site).

## Publications

`_data/orcid_publications.json` is generated; don't edit it by hand. The **Sync ORCID Publications**
workflow runs on the 1st of every month (or on demand from the Actions tab), reads ORCID for the list of
works and Crossref for authors and journals, and commits only if something changed. To run it locally:

```bash
python3 sync_orcid_publications.py
```

## Making EthoCrypt public

1. Get GitHub Pro (free with the GitHub Student Developer Pack) so Pages works on the private repo.
2. In `bfnerdly/ethocrypt`: Settings → Pages → Source: **GitHub Actions**, then re-run its Pages workflow.
   It publishes to `https://bfnerdly.github.io/ethocrypt/`.
3. Here, set `ethocrypt.pages_live: true` in `_config.yml` (and `repo_public: true` if the repo itself goes public).

## Résumé button

Save a general (not job-specific) PDF as `assets/files/Fricker_Resume.pdf`, then set
`links.cv: /assets/files/Fricker_Resume.pdf` in `_config.yml`. A "Résumé" button appears on the home page.

## Social card

`assets/images/social-card.jpg` (1200×630) is the preview shown when the site is shared. Its source is
`tools/social-card.html`: edit it, open it in Chrome at 1200×630, and screenshot it to regenerate.
The EthoCrypt page's card is `tools/ethocrypt-social-card.html` (it reads fonts from the sibling `ethocrypt` repo).

## Local preview

```bash
bundle install
LANG=en_US.UTF-8 bundle exec jekyll serve --livereload
```
