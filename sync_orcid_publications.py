"""Sync publications from ORCID into _data/orcid_publications.json.

ORCID supplies the list of works (so adding a paper to ORCID is all it takes).
Crossref, looked up by DOI, supplies the full author list, journal and date,
which ORCID records often lack. Hand-tuned details (equal-contribution marks,
plain-language summaries, featured papers) live in _data/publication_overrides.yml
and are merged at render time, so this script never overwrites them.

Standard library only. Run locally with:  python3 sync_orcid_publications.py
"""

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from typing import Any
from urllib import error, parse, request

ORCID_ID = "0000-0002-6037-814X"
ORCID_API = f"https://pub.orcid.org/v3.0/{ORCID_ID}"
CROSSREF_API = "https://api.crossref.org/works/"
OUTPUT_PATH = Path("_data/orcid_publications.json")
USER_AGENT = "bfnerdly.github.io publication sync (https://bfnerdly.github.io; mailto:bfricker@g.harvard.edu)"
TIMEOUT_SECONDS = 20
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2
OWNER_FAMILY_NAME = "fricker"
OWNER_GIVEN_INITIAL = "b"

# Work types from ORCID that count as publications on the site.
PUBLICATION_TYPES = {
    "book", "book-chapter", "conference-paper", "dissertation-thesis", "edited-book",
    "journal-article", "preprint", "report", "review", "working-paper",
}
# Tags allowed through from Crossref titles (species names are italicised there).
ALLOWED_TITLE_TAGS = re.compile(r"</?(i|em|sub|sup)>", re.IGNORECASE)


def log(message: str) -> None:
    print(message, flush=True)


def fetch_json(url: str, *, required: bool = True) -> dict[str, Any] | None:
    last_error: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = request.Request(url, headers={"Accept": "application/json", "User-Agent": USER_AGENT})
            with request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
                return json.load(response)
        except error.HTTPError as exc:
            last_error = exc
            if exc.code == 404:
                break
        except (error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY_SECONDS * attempt)
    if required:
        raise RuntimeError(f"Unable to fetch {url}: {last_error}")
    log(f"  warning: could not fetch {url}: {last_error}")
    return None


def dig(obj: Any, *keys: str) -> Any:
    """Safe nested lookup: ORCID returns null for many optional objects."""
    for key in keys:
        if not isinstance(obj, dict):
            return None
        obj = obj.get(key)
    return obj


def clean(value: Any) -> str | None:
    if value is None:
        return None
    text = re.sub(r"\s+", " ", str(value)).strip()
    return text or None


def initials(given: str) -> str:
    """'Brandon A.' -> 'B.A.', 'Jose-Luis' -> 'J.-L.', 'B.A.' -> 'B.A.'"""
    parts = [p for p in re.split(r"[\s.]+", given) if p]
    out = []
    for part in parts:
        out.append("-".join(f"{piece[0].upper()}." for piece in part.split("-") if piece))
    return "".join(out)


def is_owner(family: str | None, given: str | None) -> bool:
    return bool(family) and family.lower() == OWNER_FAMILY_NAME and (given or "b").lower().startswith(OWNER_GIVEN_INITIAL)


def split_credit_name(name: str) -> tuple[str | None, str]:
    """ORCID gives 'Brandon A. Fricker' or 'Fricker, B.A.'; return (given, family)."""
    if "," in name:
        family, given = [p.strip() for p in name.split(",", 1)]
        return given or None, family
    parts = name.split()
    if len(parts) == 1:
        return None, parts[0]
    return " ".join(parts[:-1]), parts[-1]


def format_authors(people: list[tuple[str | None, str]]) -> tuple[list[str], str, bool]:
    names, html, first_author = [], [], False
    for index, (given, family) in enumerate(people):
        label = f"{family}, {initials(given)}" if given else family
        names.append(label)
        if is_owner(family, given):
            html.append(f"<strong>{escape(label)}</strong>")
            first_author = first_author or index == 0
        else:
            html.append(escape(label))
    return names, ", ".join(html), first_author


def clean_title(raw: str) -> str:
    kept = ALLOWED_TITLE_TAGS.sub(lambda m: m.group(0).lower(), raw)
    # Escape everything, then restore the allowed tags.
    safe = escape(re.sub(r"<(?!/?(i|em|sub|sup)>)[^>]+>", "", kept, flags=re.IGNORECASE), quote=False)
    safe = re.sub(r"&lt;(/?(?:i|em|sub|sup))&gt;", r"<\1>", safe)
    return clean(safe) or ""


def crossref_record(doi: str) -> dict[str, Any] | None:
    payload = fetch_json(CROSSREF_API + parse.quote(doi, safe=""), required=False)
    return dig(payload, "message") if payload else None


def date_parts(record: dict[str, Any] | None) -> list[int]:
    for key in ("published-print", "published-online", "issued", "published"):
        parts = dig(record, key, "date-parts")
        if parts and parts[0] and parts[0][0]:
            return [int(p) for p in parts[0]]
    return []


def build_publication(summary: dict[str, Any], detail: dict[str, Any]) -> dict[str, Any] | None:
    work_type = (clean(summary.get("type")) or "").lower()
    if work_type not in PUBLICATION_TYPES:
        return None

    doi = None
    for ext in dig(detail, "external-ids", "external-id") or []:
        if (clean(dig(ext, "external-id-type")) or "").lower() == "doi":
            doi = clean(dig(ext, "external-id-value"))
            break
    if doi:
        doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi, flags=re.IGNORECASE).lower()

    cr = crossref_record(doi) if doi else None

    # Authors: Crossref first (complete, ordered), ORCID contributors as fallback.
    people: list[tuple[str | None, str]] = []
    for author in (cr or {}).get("author") or []:
        family = clean(author.get("family")) or clean(author.get("name"))
        if family:
            people.append((clean(author.get("given")), family))
    if not people:
        for contributor in dig(detail, "contributors", "contributor") or []:
            credit = clean(dig(contributor, "credit-name", "value"))
            if credit:
                people.append(split_credit_name(credit))
    authors, authors_html, first_author = format_authors(people)

    title = None
    cr_titles = (cr or {}).get("title") or []
    if cr_titles:
        title = clean_title(cr_titles[0])
    title = title or escape(clean(dig(detail, "title", "title", "value")) or "", quote=False)
    if not title:
        return None

    parts = date_parts(cr)
    if not parts:
        year = clean(dig(detail, "publication-date", "year", "value"))
        month = clean(dig(detail, "publication-date", "month", "value"))
        parts = [int(p) for p in (year, month) if p]

    container = (cr or {}).get("container-title") or []
    journal = clean(container[0]) if container else clean(dig(detail, "journal-title", "value"))
    url = f"https://doi.org/{doi}" if doi else clean(dig(detail, "url", "value"))

    return {
        "put_code": summary.get("put-code"),
        "title": title,
        "type": work_type,
        "publication_year": str(parts[0]) if parts else None,
        "publication_month": parts[1] if len(parts) > 1 else None,
        "journal_title": journal,
        "volume": clean((cr or {}).get("volume")),
        "pages": clean((cr or {}).get("page")) or clean((cr or {}).get("article-number")),
        "doi": doi,
        "url": url,
        "authors": authors,
        "authors_html": authors_html or "Authors unavailable",
        "first_author": first_author,
    }


def build_payload() -> dict[str, Any]:
    groups = (fetch_json(f"{ORCID_API}/works") or {}).get("group") or []
    publications: list[dict[str, Any]] = []
    for group in groups:
        summary = (group.get("work-summary") or [None])[0]
        if not summary or summary.get("put-code") is None:
            continue
        if (clean(summary.get("type")) or "").lower() not in PUBLICATION_TYPES:
            continue
        detail = fetch_json(f"{ORCID_API}/work/{summary['put-code']}") or {}
        publication = build_publication(summary, detail)
        if publication:
            log(f"  {publication['publication_year']}  {re.sub('<[^>]+>', '', publication['title'])[:72]}")
            publications.append(publication)

    publications.sort(
        key=lambda p: (int(p["publication_year"] or 0), int(p["publication_month"] or 0), p["title"].lower()),
        reverse=True,
    )
    return {
        "generated_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "orcid_id": ORCID_ID,
        "count": len(publications),
        "first_author_count": sum(1 for p in publications if p["first_author"]),
        "publications": publications,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="Fetch and print without writing the data file.")
    args = parser.parse_args()

    try:
        payload = build_payload()
    except Exception as exc:
        print(f"Publication sync failed, existing data left untouched: {exc}", file=sys.stderr)
        return 1

    if payload["count"] == 0:
        print("ORCID returned no publications; existing data left untouched.", file=sys.stderr)
        return 1

    if OUTPUT_PATH.exists():
        previous = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
        if previous.get("publications") == payload["publications"]:
            log(f"No changes ({payload['count']} publications).")
            return 0

    if args.dry_run:
        log(f"Dry run: {payload['count']} publications fetched, nothing written.")
        return 0

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    log(f"Wrote {payload['count']} publications ({payload['first_author_count']} first-author) to {OUTPUT_PATH}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
