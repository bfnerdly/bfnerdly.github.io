---
layout: single
title: "Publications"
permalink: /publications/
---

{% assign publications = site.data.orcid_publications.publications %}
{% assign current_year = "" %}

<section class="journal-shell journal-section">
  <div class="journal-section__header">
    <h2 class="journal-section__title">Publications</h2>
    <span class="journal-section__meta">Synced from ORCID</span>
  </div>

  <p class="journal-publications__intro">
    This page is generated automatically from ORCID publication data and refreshed by GitHub Actions. Entries are grouped by publication year for easier scanning.
  </p>

  {% if publications and publications.size > 0 %}
    {% for publication in publications %}
      {% if publication.publication_year != current_year %}
        {% assign current_year = publication.publication_year %}
        <h3 class="journal-publications__year">{{ current_year }}</h3>
        <div class="journal-publications__list">
      {% endif %}

      <article class="journal-card journal-publication">
        <p class="journal-publication__title">{{ publication.title }}</p>
        <p class="journal-publication__meta">{{ publication.authors_html }}</p>
        <p class="journal-publication__venue">
          {% if publication.journal_title %}<em>{{ publication.journal_title }}</em>{% elsif publication.source_name %}<em>{{ publication.source_name }}</em>{% endif %}
          {% if publication.doi %}
            . <a href="https://doi.org/{{ publication.doi }}" target="_blank" rel="noopener noreferrer">DOI</a>
          {% elsif publication.url %}
            . <a href="{{ publication.url }}" target="_blank" rel="noopener noreferrer">Link</a>
          {% endif %}
        </p>
      </article>

      {% assign next_index = forloop.index %}
      {% assign next_publication = publications[next_index] %}
      {% if forloop.last or next_publication.publication_year != current_year %}
        </div>
      {% endif %}
    {% endfor %}
  {% else %}
    <p>No publications are available right now. The ORCID sync may still be running or may need attention.</p>
  {% endif %}
</section>

<section class="journal-shell journal-section">
  <div class="journal-section__header">
    <h2 class="journal-section__title">Profiles</h2>
    <span class="journal-section__meta">External records</span>
  </div>

  <div class="journal-links">
    <a class="journal-button" href="https://orcid.org/0000-0002-6037-814X" target="_blank" rel="noopener noreferrer">ORCID</a>
    <a class="journal-button journal-button--ghost" href="https://scholar.google.com/citations?user=MD8OzNcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar</a>
  </div>
</section>
