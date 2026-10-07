# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Jekyll on GitHub Pages (legacy branch build from `main`, the `github-pages` gem's Jekyll 3.10), no theme: layouts,
includes, CSS and JS all live in this repo. Confirmed by the user for the 2026-10 rebuild ("Keep Jekyll"). Plugins are
limited to the GitHub Pages allow-list (in use: jekyll-feed, jekyll-seo-tag, jekyll-sitemap). No build step beyond
Jekyll, no npm.

## Users

- **Primary: hiring managers and recruiters for data science and biostatistics roles**, especially in pharma, biotech
  and health research (the user's own priority, 2026-10-07). They skim a candidate's site between other tasks to decide
  whether to interview, and look for statistical rigor, modeling, study design and domain depth.
- **Strongly served: tech/product hiring for decision science, experimentation and A/B testing roles.** The user asked
  to keep "strong highlights" for this reader: experimental design, causal reasoning, metrics, behavioral analytics.
- **Secondary: academic peers and collaborators** checking publications, and researchers curious about EthoCrypt.

## Product Purpose

The professional home of Brandon Fricker, PhD, a behavioral neuroscientist (Harvard postdoc, Elya Lab) moving into
industry data science. It exists so a hiring reader can see, quickly and credibly, that he designs and analyzes
controlled experiments end to end and can do the same on their data. Success: a recruiter or hiring manager leaves
knowing what he does, believing the rigor is real, and with an obvious way to contact him.

## Positioning

A scientist whose whole career is controlled experiments on behavior, run end to end: designing the study and its
controls, building the hardware and pipelines that collect the data, modeling it (time-to-event, longitudinal and
time-series, high-dimensional and unsupervised), and testing causation by intervening (chemogenetics, CRISPR) rather
than stopping at correlation. He also builds tools other people use (EthoCrypt). Few candidates can show all of that
with their own published work.

## Operating Context

- Readers arrive from LinkedIn, applications, résumés and Google; many on phones, many skimming.
- Publications sync monthly from ORCID (plus Crossref for authors) by `.github/workflows/orcid-auto-update.yaml` into
  `_data/orcid_publications.json`; hand edits (featured papers, plain-language summaries, equal-contribution marks)
  live in `_data/publication_overrides.yml`.
- EthoCrypt is a separate private repo whose own GitHub Pages site (Field Guide, example report) is live at
  `https://bfnerdly.github.io/ethocrypt/`; this site's EthoCrypt page lives at `/projects/ethocrypt/` because the
  project site owns `/ethocrypt/`. Links are toggled by `ethocrypt.pages_live` / `repo_public` in `_config.yml`.
- A custom domain is planned but not yet chosen; `url` in `_config.yml` changes when it is.

## Capabilities and Constraints

- Static pages only; everything must render and read without JavaScript. Light and dark themes.
- Keep existing URLs: `/`, `/about/`, `/projects/`, `/projects/ethocrypt/`, `/publications/`, `/contact/`, `/feed.xml`.
- **Copyright (user requirement):** never reproduce, crop, trace or closely imitate figures, images or text from the
  papers. Charts on this site are original drawings of values the papers report, each cited, or schematics of an
  experiment's design. Paper photos credited to others (Dr. Carolyn Elya, Dr. Aubrey Kelly) keep their credits.
- Unpublished data (EthoCrypt pilot recordings, BFT001/BFT002 clips) must not appear. EthoCrypt app screenshots are
  from its demo mode and are labeled demo data.
- Personal contact details beyond the public email (`bfricker@g.harvard.edu`) stay off the site (no phone, no
  personal Gmail).
- Undecided: résumé PDF (the user will supply a general version; `links.cv` shows a button when set); custom domain.

## Brand Commitments

- Name as "Brandon Fricker, PhD". The headshot `assets/images/headshot-square.jpg` is the portrait in use.
- EthoCrypt has its own identity (mark, lockups, palette, defined in the EthoCrypt repo's DESIGN.md); use its assets
  unaltered when representing it.
- History, not a binding rule: the user chose a purple accent for the site in 2025 and kept a plum palette in the
  2026-09 redesign.

## Evidence on Hand

- Publications: 12 peer-reviewed papers from ORCID, 8 first-author (by author order), including *Current Biology*
  (2024) and *Psychoneuroendocrinology* (2025). The user's résumé states 13 papers / 7 first-author; ORCID is the
  source the site counts from.
- From the user's résumé (Sept 2026): PhD, Behavioral & Systems Neuroscience, Emory (2024; MS en route 2021); BS
  Behavioral Neuroscience and BS Social Psychology, Lehigh (2019, GPA 3.97); NDSEG Fellow (DoD, 3 years); postdoc,
  Elya Lab, Harvard (6/2024–present) leading four concurrent quantitative projects on computer-vision behavioral
  tracking with multi-million-point datasets; integrating neural-network methods into transcriptomic analyses;
  mentoring 7+ trainees as a postdoc and 5 undergraduates in graduate school; 5+ conference presentations; IRB member,
  St. Luke's Hospital (2017–2019), reviewing clinical study protocols for methodological rigor and participant safety;
  MCB Community Taskforce, Harvard (2024–present). Tools: Python (pandas, NumPy, SciPy, statsmodels, matplotlib), R,
  MATLAB, Git.
- Code: EthoCrypt (private; v0.3.0: mirror rig, recorder, Tauri desktop app, Slurm pipeline with SAM 2, DINOv3,
  UMAP, cluster validation); speed-behavior analysis pipelines (private; actograms, periodograms, survival-aligned
  activity); BlindTOD (public, Elya-Lab; blinded time-of-death re-scoring as a bias audit); Drosophila brain
  registration pipeline (public, R/natverse).
- Images: `assets/images/headshot-square.jpg`; `zombies-1600.jpg` (photo by Dr. Carolyn Elya); `smice-1600.jpg`
  (photo by Dr. Aubrey Kelly); EthoCrypt marks, demo-data app screenshots and rig render in
  `assets/images/ethocrypt/`.
- **Absent, do not fabricate:** industry employment history, testimonials or references, salary or title claims,
  SQL or tools not listed above, talk titles, award names beyond NDSEG, effect sizes or results not stated in the
  papers, any EthoCrypt results.

## Product Principles

1. **Prove, don't claim.** Every skill on the page is tied to a specific study, tool or paper the reader can check.
2. **Rigor reads first.** Design, controls, causal tests and honest uncertainty come before flair; nothing is
   overstated.
3. **Speak the hiring reader's language.** Translate lab work into data-science and experimentation terms without
   losing the science that makes it credible.
4. **Respect the source.** Published work is cited and never copied; others' photos keep their credits.
5. **Fast, accessible, maintainable by one person.** Plain Jekyll, no JS dependency for content, monthly data sync
   keeps working untouched.

## Accessibility & Inclusion

WCAG 2.1 AA: text contrast, visible focus, keyboard navigation, meaningful alt text, `prefers-reduced-motion`
respected, readable at 200% zoom and on 375px phones.
