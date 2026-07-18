#!/usr/bin/env python3
"""Regenerates src/data/exercices.app.json from src/data/exercices.json.

The app-facing copy drops the `instructions` field: it isn't rendered
anywhere in the UI (grep confirms no consumer) yet accounts for ~70% of the
source file's size, and being a plain static JSON import it gets bundled
into ProgramBuilder's client-side chunk wholesale regardless of what fields
are actually read from it — pushing that chunk well past the build's 500 kB
chunk-size warning threshold. `exercices.json` itself is left untouched as
the credited, full-fidelity copy of the upstream free-exercise-db dataset
(see README.md's Sources section); re-run this script after any update to
it (e.g. via add_exercise_slugs.py/transform_exercices.py) to keep the
stripped app copy in sync.
"""
import json
from pathlib import Path

SOURCE_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "exercices.json"
APP_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "exercices.app.json"


def main() -> None:
    with SOURCE_PATH.open(encoding="utf-8") as f:
        exercices = json.load(f)

    stripped = [{k: v for k, v in exercice.items() if k != "instructions"} for exercice in exercices]

    with APP_PATH.open("w", encoding="utf-8") as f:
        json.dump(stripped, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(stripped)} exercises (without instructions) to {APP_PATH}")


if __name__ == "__main__":
    main()
