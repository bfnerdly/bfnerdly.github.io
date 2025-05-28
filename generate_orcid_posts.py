import requests
import os
import re

# === CONFIG ===
orcid_id = "0000-0002-6037-814X"
api_url = f"https://pub.orcid.org/v3.0/{orcid_id}/works"
headers = {"Accept": "application/json"}
output_dir = "_posts"
os.makedirs(output_dir, exist_ok=True)

# === FETCH ORCID DATA ===
res = requests.get(api_url, headers=headers)
if res.status_code != 200:
    print("Failed to fetch data from ORCID")
    exit()

works = res.json().get("group", [])

# === GENERATE POSTS ===
for work in works:
    summary = work["work-summary"][0]
    title = summary["title"]["title"]["value"]
    year = summary.get("publication-date", {}).get("year", {}).get("value", "2025")

    # Extract DOI if available
    doi = None
    for ext in summary.get("external-ids", {}).get("external-id", []):
        if ext["external-id-type"].lower() == "doi":
            doi = ext["external-id-value"]
            break

    # Sanitize filename slug
    slug = re.sub(r"[^\w\-]", "", title.lower().replace(" ", "-"))[:40]
    filename = f"{year}-orcid-{slug}.md"
    path = os.path.join(output_dir, filename)

    if os.path.exists(path):
        continue  # Skip existing files

    with open(path, "w", encoding="utf-8") as f:
        f.write(f"---\n")
        f.write(f"title: \"{title}\"\n")
        f.write(f"date: {year}-01-01\n")
        f.write(f"categories: [orcid-publication]\n")
        f.write(f"---\n\n")
        f.write(f"Published in {year}.\n\n")
        if doi:
            f.write(f"[DOI link](https://doi.org/{doi})\n")

print("✅ ORCID posts generated.")
