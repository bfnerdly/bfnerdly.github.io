---
layout: single
title: "Publications"
permalink: /publications/
---

<p style="margin-bottom: 2em;">
  This page is automatically generated from ORCID publication data and refreshes on a monthly GitHub Actions schedule.
</p>

<h2 style="font-size: 1.8em;">Publications</h2>

{% assign publications = site.data.orcid_publications.publications %}

{% if publications and publications.size > 0 %}
<div style="display: flex; flex-direction: column; gap: 1.8em;">
{% for publication in publications %}
<div>
  <strong style="font-size: 1.1em;">{{ publication.title }}</strong><br>
  <span style="font-size: 0.9em;">{{ publication.authors_html }}{% if publication.publication_year %} ({{ publication.publication_year }}){% endif %}</span><br>
  {% if publication.journal_title %}<em>{{ publication.journal_title }}</em>{% elsif publication.source_name %}<em>{{ publication.source_name }}</em>{% endif %}
  {% if publication.doi %}
    . <a href="https://doi.org/{{ publication.doi }}" target="_blank" rel="noopener noreferrer">DOI</a>
  {% elsif publication.url %}
    . <a href="{{ publication.url }}" target="_blank" rel="noopener noreferrer">Link</a>
  {% endif %}
</div>
{% endfor %}
</div>
{% else %}
<p>No publications are available right now. The ORCID sync may still be running or may need attention.</p>
{% endif %}

---

<h2 style="font-size: 1.8em;">Online Profiles</h2>

<div style="text-align: center; margin-top: 2em;">
  <a href="https://orcid.org/0000-0002-6037-814X" target="_blank" rel="noopener noreferrer" style="margin: 0 15px;">
    <i class="fab fa-orcid fa-2x" aria-hidden="true" title="ORCID Profile"></i>
  </a>
  <a href="https://scholar.google.com/citations?user=MD8OzNcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" style="margin: 0 15px;">
    <i class="fas fa-graduation-cap fa-2x" aria-hidden="true" title="Google Scholar"></i>
  </a>
</div>
