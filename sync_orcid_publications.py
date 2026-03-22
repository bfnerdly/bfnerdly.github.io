import argparse
import json
import sys
import time
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from typing import Any
from urllib import error, request


ORCID_ID = "0000-0002-6037-814X"
API_ROOT = f"https://pub.orcid.org/v3.0/{ORCID_ID}"
OUTPUT_PATH = Path("_data/orcid_publications.json")
REQUEST_HEADERS = {
    "Accept": "application/json",
    "User-Agent": "bfnerdly.github.io publication sync",
}
REQUEST_TIMEOUT_SECONDS = 20
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2
HIGHLIGHTED_AUTHOR_NAMES = {
    "Brandon Fricker",
    "Brandon A. Fricker",
    "B.A. Fricker",
    "Fricker, B.A.",
    "Fricker, Brandon",
}
PUBLICATION_TYPES = {
    "book",
    "book-chapter",
    "book-review",
    "conference-abstract",
    "conference-paper",
    "dictionary-entry",
    "dissertation-thesis",
    "edited-book",
    "encyclopedia-entry",
    "journal-article",
    "magazine-article",
    "manual",
    "newspaper-article",
    "online-resource",
    "preprint",
    "report",
    "review",
    "supervised-student-publication",
    "technical-standard",
    "working-paper",
}


def log(message: str) -> None:
    print(message)


def fetch_json(url: str) -> dict[str, Any]:
    last_error: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = request.Request(url, headers=REQUEST_HEADERS)
            with request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                return json.load(response)
        except (error.HTTPError, error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt == MAX_RETRIES:
                break
            log(f"Request failed for {url} (attempt {attempt}/{MAX_RETRIES}): {exc}")
            time.sleep(RETRY_DELAY_SECONDS)
    raise RuntimeError(f"Unable to fetch ORCID data from {url}: {last_error}") from last_error


def clean_text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def extract_doi(external_ids: dict[str, Any]) -> str | None:
    for ext in external_ids.get("external-id", []):
        ext_type = clean_text(ext.get("external-id-type"))
        if ext_type and ext_type.lower() == "doi":
            return clean_text(ext.get("external-id-value"))
    return None


def preferred_url(detail: dict[str, Any], doi: str | None) -> str | None:
    url_value = clean_text(detail.get("url", {}).get("value"))
    if url_value:
        return url_value
    if doi:
        return f"https://doi.org/{doi}"
    return None


def format_authors(contributors: dict[str, Any]) -> tuple[list[str], str]:
    names: list[str] = []
    for contributor in contributors.get("contributor", []):
        credit_name = clean_text(contributor.get("credit-name", {}).get("value"))
        if credit_name:
            names.append(credit_name)

    unique_names: list[str] = []
    seen: set[str] = set()
    for name in names:
        if name not in seen:
            unique_names.append(name)
            seen.add(name)

    if not unique_names:
        return [], "Authors unavailable"

    formatted: list[str] = []
    for name in unique_names:
        safe_name = escape(name)
        if name in HIGHLIGHTED_AUTHOR_NAMES:
            formatted.append(f"<strong>{safe_name}</strong>")
        else:
            formatted.append(safe_name)
    return unique_names, ", ".join(formatted)


def extract_publication_date(detail: dict[str, Any]) -> tuple[str | None, str | None, str | None]:
    publication_date = detail.get("publication-date", {})
    year = clean_text(publication_date.get("year", {}).get("value"))
    month = clean_text(publication_date.get("month", {}).get("value"))
    day = clean_text(publication_date.get("day", {}).get("value"))
    return year, month, day


def build_publication(summary: dict[str, Any], detail: dict[str, Any]) -> dict[str, Any] | None:
    work_type = clean_text(summary.get("type"))
    if not work_type:
        return None
    work_type = work_type.lower()
    if work_type not in PUBLICATION_TYPES:
        return None

    put_code = summary.get("put-code")
    title = clean_text(detail.get("title", {}).get("title", {}).get("value"))
    if put_code is None or not title:
        return None

    external_ids = detail.get("external-ids", {})
    doi = extract_doi(external_ids)
    authors, authors_html = format_authors(detail.get("contributors", {}))
    year, month, day = extract_publication_date(detail)

    return {
        "put_code": put_code,
        "title": title,
        "type": work_type,
        "publication_year": year,
        "publication_month": month,
        "publication_day": day,
        "journal_title": clean_text(detail.get("journal-title", {}).get("value")),
        "source_name": clean_text(detail.get("source", {}).get("source-name", {}).get("value")),
        "doi": doi,
        "url": preferred_url(detail, doi),
        "orcid_url": f"https://orcid.org/{ORCID_ID}",
        "authors": authors,
        "authors_html": authors_html,
        "external_ids": [
            {
                "type": clean_text(ext.get("external-id-type")),
                "value": clean_text(ext.get("external-id-value")),
                "url": clean_text(ext.get("external-id-url", {}).get("value")),
            }
            for ext in external_ids.get("external-id", [])
            if clean_text(ext.get("external-id-value"))
        ],
    }


def publication_sort_key(item: dict[str, Any]) -> tuple[int, int, int, str]:
    year = int(item.get("publication_year") or 0)
    month = int(item.get("publication_month") or 0)
    day = int(item.get("publication_day") or 0)
    title = item.get("title", "").lower()
    return (year, month, day, title)


def build_payload() -> tuple[dict[str, Any], dict[str, int]]:
    works_payload = fetch_json(f"{API_ROOT}/works")
    groups = works_payload.get("group", [])
    publications: list[dict[str, Any]] = []
    skipped_non_publication = 0
    skipped_invalid = 0

    for group in groups:
        summaries = group.get("work-summary", [])
        if not summaries:
            skipped_invalid += 1
            continue

        summary = summaries[0]
        work_type = clean_text(summary.get("type"))
        if not work_type:
            skipped_invalid += 1
            continue
        if work_type.lower() not in PUBLICATION_TYPES:
            skipped_non_publication += 1
            continue

        put_code = summary.get("put-code")
        if put_code is None:
            skipped_invalid += 1
            continue

        detail = fetch_json(f"{API_ROOT}/work/{put_code}")
        publication = build_publication(summary, detail)
        if publication is None:
            skipped_invalid += 1
            continue
        publications.append(publication)

    publications.sort(key=publication_sort_key, reverse=True)

    payload = {
        "generated_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "orcid_id": ORCID_ID,
        "publication_types": sorted(PUBLICATION_TYPES),
        "publications": publications,
    }
    stats = {
        "fetched_groups": len(groups),
        "written_publications": len(publications),
        "skipped_non_publication": skipped_non_publication,
        "skipped_invalid": skipped_invalid,
    }
    return payload, stats


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync ORCID publications into Jekyll data.")
    parser.add_argument("--dry-run", action="store_true", help="Fetch and validate data without writing the output file.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        payload, stats = build_payload()
    except Exception as exc:  # pragma: no cover
        print(f"Publication sync failed: {exc}", file=sys.stderr)
        return 1

    if not args.dry_run:
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    log(
        "Publication sync complete: "
        f"{stats['written_publications']} written, "
        f"{stats['skipped_non_publication']} skipped as non-publication, "
        f"{stats['skipped_invalid']} skipped as invalid, "
        f"{stats['fetched_groups']} ORCID groups scanned."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
