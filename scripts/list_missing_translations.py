#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXERCISES_PATH = ROOT / "src" / "data" / "exercices.json"
TRANSLATIONS_PATH = ROOT / "src" / "data" / "exercise-names.fr.json"


def main() -> int:
    with EXERCISES_PATH.open(encoding="utf-8") as f:
        exercices = json.load(f)
    with TRANSLATIONS_PATH.open(encoding="utf-8") as f:
        translations = json.load(f)

    total = len(exercices)
    missing = [e["slug"] for e in exercices if e["slug"] not in translations]
    translated = total - len(missing)
    coverage = (translated / total * 100) if total else 0

    print(f"Total exercises:        {total}")
    print(f"Translated (fr):        {translated}")
    print(f"Falling back to English: {len(missing)}")
    print(f"Coverage:               {coverage:.1f}%")

    if missing:
        print("\nMissing slugs:")
        for slug in missing:
            print(f"  {slug}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
