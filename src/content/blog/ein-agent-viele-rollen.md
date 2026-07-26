---
title: 'Ein Agent, viele Rollen: Autor, Lektor, Faktenprüfer'
description: 'Dieselbe Instanz nacheinander in drei Rollen laufen zu lassen, klingt nach einem Trick. Der Unterschied liegt darin, was sie jeweils sieht.'
pubDate: 2026-07-03
category: 'Agenten'
topics: ['Rollen', 'Prompting', 'Workflow']
readingTime: 5
---

Es hilft nichts, einem Modell zu sagen, es sei jetzt Lektor. Eine Rollenbeschreibung
ändert den Ton, nicht das Urteil. Was das Urteil ändert, ist der Ausschnitt der
Information, auf den die Rolle Zugriff hat.

## Autor

Sieht: Gliederung, Rechercheergebnisse, Längenbudget. Sieht nicht: frühere Entwürfe
desselben Beitrags. Das verhindert, dass Formulierungen aus einer verworfenen Version
zurückkriechen.

## Lektor

Sieht: den Entwurf und die Gliederung. Sieht nicht: die Recherche. Die Aufgabe ist
ausschliesslich, ob der Text die Gliederung einlöst, ob er sich wiederholt und ob die
Übergänge tragen. Ohne Rechercheergebnisse kann der Lektor nicht in eine Faktendiskussion
abgleiten, die nicht seine ist.

## Faktenprüfer

Sieht: die Behauptungsliste und die Quellen. Sieht nicht: den Beitragstext. Das ist die
wichtigste der drei Trennungen. Ein flüssig geschriebener Absatz macht eine schwach
belegte Aussage überzeugender, als sie ist — die Behauptung isoliert zu prüfen nimmt
diesen Effekt heraus.

## Warum das keine echte Arbeitsteilung ist

Alle drei Rollen teilen die Schwächen desselben Modells. Wenn es einen systematischen
blinden Fleck gibt, haben ihn alle drei. Die Trennung schützt gegen Effekte des Kontexts,
nicht gegen Eigenschaften des Modells.

Für die zweite Klasse von Fehlern hilft nur ein anderes Modell — oder ein Mensch.
