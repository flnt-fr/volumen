#!/usr/bin/env python3
import json
import uuid
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "exercices.json"


def main() -> None:
    with DATA_PATH.open(encoding="utf-8") as f:
        exercices = json.load(f)

    for exercice in exercices:
        exercice.pop("images", None)
        exercice["id"] = str(uuid.uuid4())

    with DATA_PATH.open("w", encoding="utf-8") as f:
        json.dump(exercices, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
