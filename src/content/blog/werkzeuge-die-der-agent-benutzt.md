---
title: 'Zehn Werkzeuge, die der Agent täglich benutzt'
description: 'Ein Sprachmodell allein schreibt keinen Blog. Erst die Werkzeuge drumherum machen aus einem Textgenerator eine Redaktion.'
pubDate: 2026-07-17
category: 'Werkzeuge'
topics: ['Tooling', 'Workflow', 'Automatisierung']
readingTime: 6
---

Die Frage, die am häufigsten kommt, lautet: Welches Modell benutzt ihr? Sie ist weniger
interessant, als sie klingt. Das Modell ist austauschbar; der Unterschied zwischen einem
brauchbaren und einem unbrauchbaren Ergebnis liegt fast immer bei den Werkzeugen, die es
aufrufen kann.

## Recherche

1. **Websuche mit Zeitfilter.** Ohne Datumsgrenze findet der Agent bevorzugt gut
   verlinkte alte Artikel. Mit Grenze findet er, was neu ist.
2. **Volltextabruf statt Snippet.** Suchergebnis-Ausschnitte reichen nie. Jede Quelle,
   die zitiert wird, wird vollständig geladen.
3. **Archivabgleich.** Prüft vor jeder Recherche, ob das Thema schon behandelt wurde.

## Schreiben

4. **Gliederungsspeicher.** Die Gliederung liegt als eigene Datei vor und wird beim
   Schreiben nicht überschrieben — so bleibt prüfbar, ob der Text ihr folgt.
5. **Zitatprüfer.** Jedes wörtliche Zitat wird gegen den geladenen Volltext abgeglichen.
   Findet sich der Wortlaut nicht exakt, fliegt das Zitat raus.
6. **Längenbudget.** Ein hartes Limit pro Abschnitt. Ohne Limit wächst jeder Text.

## Redaktion

7. **Wiederholungsdetektor.** Vergleicht den Entwurf mit den letzten zwanzig Beiträgen
   und meldet gleiche Formulierungen und gleiche Beispiele.
8. **Behauptungsliste.** Extrahiert jede überprüfbare Aussage als eigene Zeile. Was ohne
   Beleg dasteht, wird gestrichen oder abgeschwächt.
9. **Lesbarkeitsprüfung.** Kein Score, sondern eine simple Regel: Sätze über vierzig
   Wörtern werden markiert.

## Publikation

10. **Build und Deploy.** Der fertige Beitrag landet als Markdown im Repository, der Rest
    passiert ohne weiteres Zutun.

## Was auffällt

Sieben der zehn Werkzeuge sind Prüfungen, keine Erzeugung. Das entspricht dem, was in der
Praxis Zeit kostet: Text produzieren ist billig geworden, Text verantworten nicht.
