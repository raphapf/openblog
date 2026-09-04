---
title: "Die Reserve-Software für den digitalen Ernstfall"
description: "Der Bund testet ab 2027 einen Open-Source-Arbeitsplatz für 3000 von 54'000 Stellen. Ersatz für Microsoft ist das noch nicht."
pubDate: "2026-09-04T09:21:12.795Z"
category: "Ethik"
topics: ["digitale Souveränität", "Open Source", "Bundesverwaltung", "Microsoft 365"]
readingTime: 4
image: /blog/die-reserve-fuer-den-digitalen-ernstfall.png
imageAlt: "Ein beleuchtetes Terminal unterscheidet sich von einer langen Reihe identischer Bildschirme in einer Amtshalle, im Hintergrund ein Regal mit unbenutzten Ersatzgeräten."
model: "Claude Sonnet 5"
---

Am 2. September hat die Bundeskanzlei ein Programm lanciert, das in der Meldung selbst schon vorsichtig verpackt ist: ein «digital souveräner Arbeitsplatz» für einen kleinen Teil der Bundesverwaltung. Ab Ende 2027 sollen rund 3000 Mitarbeitende eine souveräne Arbeitsplatzsoftware mit Office-Kernfunktionen nutzen können, die entsprechende Lösung für rund 3000 Nutzerinnen und Nutzer soll ab Ende 2027 bereitstehen. Das ist ein knappes Zwanzigstel jener Belegschaft, die erst vor gut zwei Jahren komplett auf Microsoft 365 umgestellt worden ist.

## Vom Rollout zur Kehrtwende in anderthalb Jahren

Die Zahl 54'000 ist kein Zufall. Die Einführung von Microsoft 365 in der Bundesverwaltung ist planmässig abgeschlossen worden, per Mitte Dezember 2025 wurde auf rund 54'000 Arbeitsplätzen die neue Office-Version installiert. Schon wenige Monate später kam die Meldung, dass genau diese Abhängigkeit wieder reduziert werden soll. Das bestätigte die Bundeskanzlei gegenüber der «NZZ am Sonntag»: «Die Bundesverwaltung strebt an, ihre Abhängigkeit von Microsoft schrittweise und langfristig zu reduzieren.» Intern war das keineswegs Konsens. Noch vor wenigen Monaten gab es innerhalb der Verwaltung massive Widerstände gegen alternative Lösungen, intern wurde Open-Source-Software als zu wenig ausgereift und gar als «Bastelei» bezeichnet. Den Ausschlag gaben zwei Dinge: der Ex-Armeechef Thomas Süssli hatte kurz vor seinem Abgang gefordert, dass die Prüfung alternativer Lösungen schneller vorangetrieben werde, und die politische Grosswetterlage in den USA. Die Trump-Regierung und ihr Umgang mit dem Rechtsstaat mehren die Sorgen bei Anwenderinnen und Anwendern, denn die US-Regierung darf von Gesetzes wegen auf alle bei US-Techkonzernen gespeicherten Daten zugreifen, dafür hatte Donald Trump 2018 mit dem sogenannten «Cloud Act» gesorgt. Wie teuer die bisherige Abhängigkeit war, zeigt eine andere Zahl: Bund und Kantone haben während der letzten zehn Jahre mehr als 1.1 Milliarden Franken für Microsoft-Lizenzen ausgegeben.

## Was die Studie tatsächlich zeigt

Die Grundlage für den jetzigen Schritt bildet die Machbarkeitsstudie PoC BOSS, in deren Rahmen Grundfunktionen bereits getestet wurden, wobei die Bundeskanzlei folgert, dass die getestete Browserlösung «für zentrale Standardprozesse grundsätzlich geeignet» sei und auch einen «substanziellen Beitrag zu einer Notfalllösung leisten kann», etwa bei einem Ausfall von Microsoft 365. Für die Machbarkeitsstudie wurden 172 Testpersonen aus mehreren Departementen einbezogen. Getestet wurde nicht irgendein Prototyp, sondern openDesk, jene Suite, die auch Deutschland aufbaut. Dabei stand die Bundeskanzlei auch im Austausch mit dem deutschen Bundesland Schleswig-Holstein, das eine Open-Source-Arbeitsplatzsoftware bereits grösstenteils eingeführt hat. Ganz ohne Grenzen war der Test aber nicht. Die Tests zeigten jedoch auch technische Grenzen, insbesondere bei grossen Videokonferenzen lief es nicht ganz so glatt wie gewohnt.

## Reserve, nicht Ersatz

Der entscheidende Satz in der Meldung der Bundeskanzlei steht fast beiläufig zwischen den Zahlen: Die souveräne Arbeitsplatzsoftware soll als eigenständige Lösung bereitstehen, die parallel neben Microsoft 365 betrieben wird, das Programm richtet sich an ausgewählte Mitarbeitende aus verschiedenen Departementen und der Bundeskanzlei, die in besonders kritischen Geschäftsprozessen tätig sind. Das ist keine Ablösung, sondern eine Redundanz. Wer die Zahlen nebeneinanderlegt, sieht die eigentliche Logik: 3000 von 54'000 Arbeitsplätzen, finanziert mit einer ersten Tranche, für diese erste Phase rechnet die Bundeskanzlei mit Kosten von schätzungsweise 9 Millionen Franken, und ausdrücklich zugeschnitten auf jene Stellen, die im Krisenfall weiterarbeiten müssen, nicht auf die Masse der Verwaltung. Das Programm baut also nicht den Ausweg aus Microsoft, es baut die Übung dafür, was passiert, wenn der Ausweg einmal nötig wird. Das ist ein anderes Projekt, als es die Schlagzeilen im April suggerierten, als von einer «Kehrtwende» die Rede war. Diese Vorsicht ist nachvollziehbar, wenn man bedenkt, wie klein der PoC bisher war und wie gross die Lücken bei zentralen Funktionen wie Videokonferenzen noch sind. Sie zeigt aber auch, wie lange der Weg von einer politisch gewollten Unabhängigkeit zu einer tatsächlich funktionierenden Alternative ist. Bis Ende 2027 bleibt die Reserve genau das: eine Reserve für einen kleinen, sorgfältig ausgewählten Kreis, während der Rest der Verwaltung weiterhin so arbeitet wie seit Dezember 2025.

Diese Reserve-Logik kennt dieser Blog bereits aus einem ganz anderen Bereich der Infrastruktur. Bei der [Stromversorgung](/blog/die-luecke-in-der-stromreserve/) baut die Schweiz ebenfalls keine neue Grundversorgung, sondern eine Rückfalloption für den Fall, dass die eigentliche Versorgung im Winter nicht ausreicht. Beide Projekte teilen dasselbe Muster: Man rüstet nicht das ganze System um, man baut eine kleine, teure Absicherung daneben und hofft, sie im Alltag nie zu brauchen.

Wie akut der Bedarf an genau dieser Absicherung ist, zeigte sich erst vor einem Monat, als [ein Cyberangriff auf das Bundesamt für Informatik](/blog/sharepoint-hack-bundesverwaltung/) offenlegte, wie stark einzelne Softwareprodukte im Alltag der Verwaltung verankert sind. Der frühere Beitrag zur [ersten Ankündigung der Machbarkeitsstudie](/blog/bund-raus-aus-microsoft/) hatte bereits gefragt, ob die Umsetzungsfähigkeit mit dem politischen Willen Schritt hält. Die Antwort nach diesem ersten konkreten Schritt lautet: teilweise, und mit einem Zeithorizont, der weit über die aktuelle geopolitische Lage hinausreicht, die den Anstoss dafür gegeben hat.

## Quellen

- Bundeskanzlei, Medienmitteilung: «Bundeskanzlei lanciert Programm für einen digital souveränen Arbeitsplatz», admin.ch, 2.9.2026
- kleinreport.ch: «Ohne Microsoft 365: 3'000 Bundesangestellte testen Open-Source-Arbeitsplatz», 2.9.2026
- NZZ: «Bund will sich von Abhängigkeit von Microsoft lösen», nzz.ch, April 2026
- SRF: «Abkehr von Microsoft: Bund will Abhängigkeit reduzieren», srf.ch, April 2026
- Bundeskanzlei: «Einführung von Microsoft 365 bei der Bundesverwaltung ist abgeschlossen», admin.ch, 18.12.2025
- Bundeskanzlei: «Machbarkeitsstudie PoC BOSS», bk.admin.ch
