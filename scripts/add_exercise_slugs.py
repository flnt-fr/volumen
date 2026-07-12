#!/usr/bin/env python3
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "exercices.json"


def slugify(name: str) -> str:
    normalized = unicodedata.normalize("NFKD", name)
    ascii_name = normalized.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", lowered).strip("-")
    return slug


def main() -> None:
    with DATA_PATH.open(encoding="utf-8") as f:
        exercices = json.load(f)

    slugs = [slugify(exercice["name"]) for exercice in exercices]
    counts = Counter(slugs)
    collisions = {slug: count for slug, count in counts.items() if count > 1}
    if collisions:
        print(f"Resolving {len(collisions)} slug collision(s):")
        for slug, count in collisions.items():
            print(f"  {slug!r} used by {count} exercises")

    seen: Counter = Counter()
    for exercice, slug in zip(exercices, slugs):
        seen[slug] += 1
        exercice["slug"] = slug if seen[slug] == 1 else f"{slug}-{seen[slug]}"

    with DATA_PATH.open("w", encoding="utf-8") as f:
        json.dump(exercices, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote slugs for {len(exercices)} exercises to {DATA_PATH}")


if __name__ == "__main__":
    main()
