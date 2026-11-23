#!/usr/bin/env python3
"""Génère worker/xa-ia-worker.js : le modèle src.js + la base de soninké vérifiée.

Usage (depuis la racine du dépôt) :  python3 worker/build.py
À relancer chaque fois que xa-ia/corpus.json change.
"""
import json, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
corpus = json.loads((root / "xa-ia" / "corpus.json").read_text(encoding="utf-8"))

seen, rows = set(), []
for e in corpus["entries"]:
    key = (e["son"].strip().lower(), e["fr"].strip().lower())
    if key in seen:
        continue
    seen.add(key)
    son = e["son"].strip()
    if e.get("ton") and e["ton"] != e["son"]:
        son += " [" + e["ton"].strip() + "]"
    rows.append([son, e["fr"].strip()])

src = (root / "worker" / "src.js").read_text(encoding="utf-8")
assert "/*__CORPUS__*/ []" in src
out = src.replace("/*__CORPUS__*/ []", json.dumps(rows, ensure_ascii=False, indent=0))
(root / "worker" / "xa-ia-worker.js").write_text(out, encoding="utf-8")
print(len(rows), "entrées vérifiées intégrées dans worker/xa-ia-worker.js")
