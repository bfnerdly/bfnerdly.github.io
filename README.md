# bfnerdly.github.io

Personal site of Brandon Fricker, PhD: <https://bfnerdly.github.io>

Plain Jekyll, built by GitHub Pages from `main`. No theme: layouts, includes and CSS all live here.

## Common edits

| To change… | Edit |
|---|---|
| Name, email, social links, "open to roles" pill, résumé link | `_config.yml` |
| Top navigation | `_data/navigation.yml` |
| Home / About / Projects / Contact | `index.html`, `about.html`, `projects/index.html`, `contact.html` |
| EthoCrypt page | `projects/ethocrypt.html` (links controlled by `ethocrypt:` in `_config.yml`) |
| Featured papers, plain-language summaries, equal-contribution marks | `_data/publication_overrides.yml` |
| Colors, fonts, layout | `assets/css/main.css` (tokens at the top) |

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

## Local preview

```bash
bundle install
LANG=en_US.UTF-8 bundle exec jekyll serve --livereload
```
