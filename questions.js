(function () {
  "use strict";

  const ui = {
    eyebrow: "Vorbereitender Fragebogen",
    title: "Die neue Website für Idstein bleibt bunt.",
    description: "Mit diesem Fragebogen klären wir die noch offenen Punkte, bevor wir ein konkretes Angebot erstellen. Viele Grundlagen wurden bereits im ersten Gespräch besprochen und werden hier nicht erneut abgefragt.",
    facts: "12 Themenbereiche · 41 zentrale Fragen",
    basisTitle: "Was bereits als Grundlage feststeht",
    start: "Fragebogen starten →",
    back: "← Zurück",
    next: "Weiter →",
    optional: "Optional",
    one: "Bitte wählen Sie eine Option.",
    many: "Mehrfachauswahl möglich – wählen Sie alle passenden Optionen.",
    max3: "Bitte wählen Sie höchstens drei Optionen.",
    section: "Bereich",
    question: "Frage",
    of: "von",
    finalTitle: "Vielen Dank. Ihre Antworten sind bereit.",
    finalText: "Prüfen Sie die Übersicht und ergänzen Sie auf Wunsch Ihren Namen und Ihre E-Mail-Adresse. Sie können die Antworten senden oder als lokale Kopie speichern.",
    filled: "Beantwortet",
    unanswered: "Offen",
    name: "Name",
    email: "E-Mail",
    returnToQuestions: "← Zurück zu den Fragen",
    download: "Antworten herunterladen",
    submit: "Antworten senden",
    submitting: "Wird gesendet …",
    sent: "Ihre Antworten wurden gesendet. Vielen Dank!",
    clear: "Gespeicherte Antworten löschen",
    clearConfirm: "Möchten Sie die lokal gespeicherten Antworten wirklich löschen?",
    saved: "Auf diesem Gerät gespeichert",
    counter: function (count, max) { return count + " / " + max; }
  };

  const basis = [
    "Relevante Inhalte der bestehenden Website sollen erhalten und in die neue Struktur übernommen werden.",
    "Bestehende Projekte und die Veranstaltungshistorie sollen erhalten bleiben.",
    "Die neue Website soll modern und professionell gestaltet sein.",
    "Die Website soll in erster Linie auf Smartphones komfortabel nutzbar sein.",
    "Die Pflege der Inhalte soll so einfach wie möglich sein.",
    "Der bestehende Newsletter-Verteiler soll erhalten bleiben.",
    "Für Social Media werden derzeit Facebook und Instagram genutzt.",
    "Die Zusammenarbeit mit der lokalen Wirtschaft soll bereits Teil der ersten Version sein.",
    "Nach dem Start ist eine laufende Betreuung von Website, Newsletter und Social Media vorgesehen.",
    "Ziel ist es, die neue Website bis zum Jahresende fertigzustellen.",
    "Technische Fragen zu Domain, Hosting, CMS, dem bestehenden System und den Zugängen werden separat geklärt."
  ];

  const sections = [
    {
      id: "goals", short: "Ziele", title: "Ziele und Zielgruppen", color: "#D9264F", intro: "Zunächst klären wir, für wen die Website entsteht und welche Wirkung sie unmittelbar erzielen soll.",
      questions: [
        { id: "1.1", title: "Welche drei Aufgaben der neuen Website sind für Sie am wichtigsten?", type: "checkbox", max: 3, options: ["Idstein bleibt bunt modern und professionell im Internet präsentieren", "Verständlich erklären, wer Idstein bleibt bunt ist und für welche Werte das Netzwerk steht", "Schnell über bevorstehende Veranstaltungen informieren", "Aktuelle Aktivitäten und Ergebnisse von IBB sichtbar machen", "Netzwerkpartner vorstellen", "Neue Mitwirkende und Netzwerkpartner gewinnen", "Junge Menschen und neue Zielgruppen besser erreichen", "Die Zusammenarbeit mit lokalen Unternehmen und Organisationen ausbauen"] },
        { id: "1.2", title: "Welche drei Besuchergruppen sind für Sie am wichtigsten?", type: "checkbox", max: 3, options: ["Einwohnerinnen und Einwohner von Idstein", "Menschen, die Veranstaltungen und Termine suchen", "Bestehende Netzwerkpartner", "Potenzielle Netzwerkpartner", "Jugendliche und junge Erwachsene", "Familien", "Ältere Menschen", "Unternehmen / Handwerk / Gastronomie / Banken", "Städtische und öffentliche Einrichtungen", "Presse / Medien"] },
        { id: "1.3", title: "Was sollen Besucherinnen und Besucher in den ersten Sekunden über Idstein bleibt bunt verstehen?", type: "textarea", hint: "Zum Beispiel: Wer Sie sind, was Sie tun, wofür Sie stehen und was gerade aktuell ist.", optional: true }
      ]
    },
    {
      id: "structure", short: "Struktur", title: "Struktur und Inhalte der Website", color: "#F28C00", intro: "Die bestehenden Themenbereiche bleiben grundsätzlich erhalten, können jedoch neu geordnet und moderner präsentiert werden. Zusätzlich soll der Bereich „Zusammenarbeit mit der lokalen Wirtschaft“ entstehen.",
      questions: [
        { id: "2.1", title: "Gibt es einen bestehenden Bereich oder ein Thema, das auf der neuen Website nicht mehr benötigt wird?", type: "radio", options: ["Nein", "Ja"], conditional: { when: "Ja", label: "Was kann entfallen?" } },
        { id: "2.2", title: "Gibt es neben der Zusammenarbeit mit der lokalen Wirtschaft ein weiteres neues Thema, das aufgenommen werden soll?", type: "radio", options: ["Nein", "Ja"], conditional: { when: "Ja", label: "Welcher Bereich oder welches Thema?" } },
        { id: "2.3", title: "Soll die Website einen eigenen Bereich für Dokumente und Materialien erhalten?", type: "radio", hint: "Zum Beispiel Flyer, Broschüren, Presseinformationen, Informationsmaterial oder PDF-Dokumente.", options: ["Ja, als eigener Bereich „Downloads / Materialien“", "Dokumente können auf den jeweils passenden Seiten eingebunden werden", "Derzeit besteht dafür kein Bedarf", "Wir wünschen eine Empfehlung"] },
        { id: "2.4", title: "Welche Informationen sollen bereits auf der Startseite besonders sichtbar und schnell erreichbar sein?", type: "checkbox", max: 3, options: ["Die nächsten Veranstaltungen", "Wer Idstein bleibt bunt ist und was das Netzwerk macht", "Aktuelle Nachrichten und wichtige Themen", "Projekte und laufende Aktivitäten von IBB", "Netzwerkpartner", "Möglichkeiten zum Mitmachen oder Unterstützen", "Kontaktinformationen", "Newsletter-Anmeldung", "Zusammenarbeit mit der lokalen Wirtschaft"] }
      ]
    },
    {
      id: "projects", short: "Projekte", title: "Projekte und Netzwerkpartner", color: "#F2C300", intro: "Wir gehen davon aus, dass die bestehenden Projekte auf die neue Website übernommen werden. Für die Übernahme des Netzwerks wird eine aktuelle Liste der aktiven Organisationen benötigt.",
      questions: [
        { id: "3.1", title: "Gibt es bestehende Projekte, die nicht auf die neue Website übernommen werden sollen?", type: "radio", options: ["Nein, die bestehenden Projekte sollen erhalten bleiben", "Ja, einzelne Projekte sollen nicht übernommen werden"], conditional: { when: "Ja, einzelne Projekte sollen nicht übernommen werden", label: "Welche Projekte sollen nicht übernommen werden?" } },
        { id: "3.2", title: "Welche Informationen sollen bei einem einzelnen Projekt gezeigt werden?", type: "checkbox", options: ["Titel", "Kurzbeschreibung", "Ausführliche Beschreibung", "Bilder", "Zeitraum / Datum des Projekts", "Zugehörige Veranstaltungen", "Ergebnisse / Rückblick", "Links oder Dokumente", "Wir wünschen eine Empfehlung"] },
        { id: "3.3", title: "Welche Informationen sollen zu einem Netzwerkpartner angezeigt werden?", type: "radio", options: ["Nur das Logo", "Logo, Name und Link", "Logo, Name, Kurzbeschreibung und Link", "Wir wünschen eine Empfehlung"] },
        { id: "3.4", title: "Sollen Netzwerkpartner nach Kategorien gegliedert werden?", type: "radio", hint: "Zum Beispiel Schulen, Kirchen und Religionsgemeinschaften, Parteien, Vereine, Unternehmen, öffentliche Einrichtungen, soziale Einrichtungen und weitere Kategorien.", options: ["Ja", "Nein", "Wir wünschen eine Empfehlung"], conditional: { when: "Ja", label: "Welche Kategorien sind aus Ihrer Sicht sinnvoll?" } }
      ]
    },
    {
      id: "content", short: "Inhalte", title: "Übernahme und Bearbeitung bestehender Inhalte", color: "#48A942", intro: "Die bestehende Website dient als wichtigste Grundlage für die Übernahme von Nachrichten, Veranstaltungen, Projekten, Seiten, Bildern und weiteren Materialien.",
      questions: [
        { id: "4.1", title: "Wie soll bei der Übernahme mit bestehenden Texten umgegangen werden?", type: "radio", options: ["Möglichst unverändert übernehmen", "Bei Bedarf leicht kürzen und vereinfachen", "Einzelne Texte deutlich überarbeiten und ihre Kernaussage erhalten", "Je nach Inhalt individuell entscheiden", "Wir wünschen eine Empfehlung"] },
        { id: "4.2", title: "Ist der folgende Arbeitsablauf für Sie passend?", type: "radio", note: "Bestehende Texte können bei Bedarf strukturiert, gekürzt und sprachlich vereinfacht werden. Wenn Inhalt oder Formulierung wesentlich verändert werden, erhält IBB die überarbeitete Fassung zunächst zur Prüfung und Freigabe. Erst danach wird sie veröffentlicht.", options: ["Ja, dieser Ablauf passt", "Nein", "Wir möchten den Ablauf anpassen"], conditional: { when: "Wir möchten den Ablauf anpassen", label: "Wie soll der Ablauf geändert werden?" } },
        { id: "4.3", title: "Plant IBB für die erste Version zusätzliche Inhalte bereitzustellen, die noch nicht auf der bestehenden Website vorhanden sind?", type: "radio", options: ["Nein, das wesentliche Material ist bereits auf der Website vorhanden", "Ja"], conditional: { when: "Ja", label: "Welche Inhalte?" } }
      ]
    },
    {
      id: "events", short: "Termine", title: "Veranstaltungen", color: "#00A79D", intro: "Bestehende Veranstaltungen und ihre Historie sollen übernommen werden. Für die neue Website wird eine moderne Darstellung kommender und vergangener Termine entwickelt.",
      questions: [
        { id: "5.1", title: "Welche Angaben müssen bei einer Veranstaltung unbedingt vorhanden sein?", type: "checkbox", options: ["Titel", "Datum und Uhrzeit", "Ort", "Veranstalter", "Kurzbeschreibung", "Ausführliche Beschreibung", "Bild / Flyer", "Link zu weiteren Informationen", "Link zur Anmeldung", "Zielgruppe", "Kontakt", "Wir wünschen eine Empfehlung für einen Standardumfang"] },
        { id: "5.2", title: "Welche Such- oder Filtermöglichkeiten für Veranstaltungen wären wirklich hilfreich?", type: "checkbox", note: "Besucherinnen und Besucher könnten beispielsweise nur Veranstaltungen für eine bestimmte Zielgruppe oder nur Termine von Netzwerkpartnern anzeigen.", options: ["Nach Datum", "Nach Thema", "Nach Zielgruppe", "Nach Veranstalter", "Eigene Veranstaltungen von IBB / Veranstaltungen von Netzwerkpartnern", "Keine besonderen Filter erforderlich", "Wir wünschen eine Empfehlung"] },
        { id: "5.3", title: "Ist der folgende Umgang mit vergangenen Veranstaltungen für Sie passend?", type: "radio", note: "Nach dem Termin bleibt die Veranstaltung in der Historie der Website erhalten. Wenn Material vorhanden ist, können einige Fotos und ein kurzer Rückblick ergänzt werden.", options: ["Ja", "Nur bei besonders wichtigen Veranstaltungen", "Nein, die ursprüngliche Beschreibung reicht aus", "Andere Lösung"], conditional: { when: "Andere Lösung", label: "Kommentar" } },
        { id: "5.4", title: "Wie viele Fotos nach einer Veranstaltung erscheinen Ihnen sinnvoll?", type: "radio", options: ["Einige ausgewählte Fotos, zum Beispiel 3–8", "Mehr Fotos, wenn gutes Material vorhanden ist", "Abhängig von der Veranstaltung", "Wir wünschen eine Empfehlung"] },
        { id: "5.5", title: "Gibt es Veranstaltungsarten, die auf der Website besonders hervorgehoben werden sollen?", type: "radio", hint: "Zum Beispiel große eigene Veranstaltungen von IBB, besondere Aktionen oder Angebote für Jugendliche.", options: ["Nein", "Ja"], conditional: { when: "Ja", label: "Welche?" } }
      ]
    },
    {
      id: "management", short: "Pflege", title: "Eigenständige Pflege durch IBB", color: "#1597B8", intro: "Die Website soll einfach zu pflegen sein, auch wenn ein wesentlicher Teil der laufenden Betreuung durch den Auftragnehmer erfolgt.",
      questions: [
        { id: "6.1", title: "Welche Inhalte möchten Vertreterinnen und Vertreter von IBB bei Bedarf selbst hinzufügen oder bearbeiten können?", type: "checkbox", options: ["Veranstaltungen", "Nachrichten / kurze Rückblicke", "Bilder", "Einfache Texte auf bestehenden Seiten", "Projekte", "Netzwerkpartner", "Die wichtigsten Inhalte sollten möglichst vollständig selbst bearbeitet werden können", "Minimale Bearbeitungsmöglichkeiten reichen aus, da die laufende Pflege überwiegend durch den Auftragnehmer erfolgt"] },
        { id: "6.2", title: "Wie viele Personen werden voraussichtlich Zugriff auf die Bearbeitung der Website erhalten?", type: "radio", options: ["1 Person", "2 Personen", "3–4 Personen", "Noch nicht festgelegt"] },
        { id: "6.3", title: "Ist der vorgeschlagene Abstimmungsprozess für Inhalte passend?", type: "radio", flow: ["Information / Ausgangsmaterial", "Vorbereitung durch den Auftragnehmer", "Kurze Prüfung durch IBB", "Veröffentlichung nach Freigabe"], options: ["Ja", "Nein", "Wir möchten den Ablauf anpassen"], conditional: { when: "Wir möchten den Ablauf anpassen", label: "Wie soll die Abstimmung organisiert werden?" } },
        { id: "6.4", title: "Wie möchten Sie vorbereitete Inhalte am liebsten freigeben?", type: "radio", options: ["Per E-Mail", "Über Messenger / WhatsApp", "In einem gemeinsamen Arbeitssystem oder Dokument", "Der Weg ist nicht entscheidend", "Wir wünschen einen Vorschlag"] }
      ]
    },
    {
      id: "newsletter", short: "Newsletter", title: "Newsletter", color: "#6047B5", intro: "Der bestehende Verteiler soll erhalten bleiben. Die Häufigkeit kann sich nach der Zahl der Veranstaltungen und aktuellen Themen richten.",
      questions: [
        { id: "7.1", title: "Welcher Grundsatz für die Newsletter-Kommunikation passt am besten zu Ihnen?", type: "radio", note: "Es geht nicht um eine feste Zahl von E-Mails pro Monat, sondern um die grundsätzliche Logik des Versands.", options: ["Ein Newsletter wird versendet, sobald genügend aktuelle Informationen vorliegen", "Ein regelmäßiger allgemeiner Newsletter bündelt Nachrichten, Projekte und kommende Veranstaltungen", "Der Schwerpunkt liegt auf der Kommunikation rund um wichtige Veranstaltungen", "Kombination aus allgemeinem Newsletter und separaten Ausgaben zu wichtigen Veranstaltungen", "Wir wünschen eine Empfehlung"] },
        { id: "7.2", title: "Welche Inhalte sollen üblicherweise im Newsletter erscheinen?", type: "checkbox", options: ["Kommende Veranstaltungen", "Nachrichten von IBB", "Projekte", "Rückblicke auf vergangene Veranstaltungen", "Nachrichten von Netzwerkpartnern", "Zusammenarbeit mit der lokalen Wirtschaft", "Themen zu Demokratie, Vielfalt, Respekt und den Werten von IBB"] },
        { id: "7.3", title: "Ist für besonders wichtige Veranstaltungen der folgende Kommunikationsablauf passend?", type: "radio", timeline: ["Erste Ankündigung einige Wochen vor der Veranstaltung", "Bei Bedarf eine Erinnerung kurz vor dem Termin", "Nach der Veranstaltung ein kurzer Rückblick mit Fotos und den wichtigsten Ergebnissen"], options: ["Ja", "Ja, aber nur bei ausgewählten großen Veranstaltungen", "Nein, Informationen im allgemeinen Newsletter reichen aus", "Wir wünschen eine Empfehlung"] },
        { id: "7.4", title: "Wer liefert die Ausgangsinformationen für den Newsletter?", type: "radio", options: ["IBB liefert die wichtigsten Fakten und Materialien, der Auftragnehmer erstellt den Newsletter", "Es werden überwiegend bereits veröffentlichte Inhalte der Website verwendet", "Kombination aus beiden Varianten"] },
        { id: "7.5", title: "Werden neben dem regulären Newsletter besondere Ausgaben für wichtige Themen, Kampagnen oder dringende Mitteilungen benötigt?", type: "radio", options: ["Ja", "Nein", "Nur bei Bedarf", "Wir wünschen eine Empfehlung"] }
      ]
    },
    {
      id: "social", short: "Social Media", title: "Facebook und Instagram", color: "#C20A7A", intro: "Derzeit ist die Arbeit mit den bestehenden Kanälen auf Facebook und Instagram vorgesehen.",
      questions: [
        { id: "8.1", title: "Ist der folgende Kommunikationsablauf rund um wichtige Veranstaltungen passend?", type: "radio", stages: [{ label: "Vorher", text: "Ankündigung und bei Bedarf Erinnerung." }, { label: "Währenddessen", text: "Kurzer Beitrag oder eine Story, wenn geeignetes Material vorhanden ist." }, { label: "Danach", text: "Fotos und ein kurzer Bericht oder Rückblick." }], options: ["Ja", "Nur bei den wichtigsten Veranstaltungen", "Wir wünschen eine andere Empfehlung"], conditional: { when: "Wir wünschen eine andere Empfehlung", label: "Kommentar / Wunsch" } },
        { id: "8.2", title: "Welche weiteren Themen sollen regelmäßig in den sozialen Medien erscheinen?", type: "checkbox", options: ["Nachrichten von IBB", "Projekte", "Vorstellung von Netzwerkpartnern", "Zusammenarbeit mit lokalen Unternehmen", "Demokratie", "Vielfalt", "Respekt und Toleranz", "Menschenrechte", "Informationen für Jugendliche", "Ausbildung / Praktikum / Zusammenarbeit mit Schulen"] },
        { id: "8.3", title: "Wie aktiv soll der Auftragnehmer selbst Themen für neue Beiträge vorschlagen?", type: "radio", options: ["Der Auftragnehmer kann regelmäßig eigene Themen und Ideen vorschlagen", "Beiträge sollen überwiegend aus den Aktivitäten und Materialien von IBB entstehen", "Kombination aus beiden Varianten", "Wir wünschen eine Empfehlung"] }
      ]
    },
    {
      id: "business", short: "Wirtschaft", title: "Zusammenarbeit mit der lokalen Wirtschaft", color: "#0E4A9A", intro: "Dieser Bereich soll bereits in die erste Version der neuen Website aufgenommen werden.",
      questions: [
        { id: "9.1", title: "Was sollen Vertreterinnen und Vertreter lokaler Unternehmen in diesem Bereich erfahren?", type: "checkbox", options: ["Wer Idstein bleibt bunt ist", "Warum eine Zusammenarbeit mit IBB interessant sein kann", "Welche Formen der Zusammenarbeit möglich sind", "Welche Unternehmen bereits mit dem Netzwerk zusammenarbeiten", "Wie IBB erreichbar ist", "Möglichkeiten für Praktikum / Ausbildung", "Zusammenarbeit mit Schulen", "Möglichkeiten zur Unterstützung eines Projekts oder einer Veranstaltung"] },
        { id: "9.2", title: "Sollen Unternehmen, die bereits mit IBB zusammenarbeiten, gesondert vorgestellt werden?", type: "radio", options: ["Ja", "Nein", "Derzeit gibt es noch zu wenige Partner, die Möglichkeit soll aber vorgesehen werden", "Wir wünschen eine Empfehlung"] },
        { id: "9.3", title: "Gibt es bereits konkrete Formen der Zusammenarbeit mit Unternehmen, die auf der Website unbedingt gezeigt werden sollen?", type: "radio", hint: "Zum Beispiel Praktikum, Ausbildung, Unterstützung konkreter Projekte, gemeinsame Aktionen oder die Zusammenarbeit mit Schulen.", options: ["Noch nicht", "Ja"], conditional: { when: "Ja", label: "Welche?" } }
      ]
    },
    {
      id: "design", short: "Gestaltung", title: "Visuelle Ausrichtung", color: "#F28C00", intro: "Die ersten vorgestellten Ansätze für die neue visuelle Ausrichtung wurden positiv aufgenommen. Die detaillierte Gestaltung soll anhand konkreter Entwürfe abgestimmt werden.",
      questions: [
        { id: "10.1", title: "Gibt es etwas, das auf der neuen Website auf keinen Fall vorkommen soll?", type: "radio", hint: "Zum Beispiel bestimmte Farben, ein zu offizieller Stil, zu viel Text oder eine komplizierte Navigation.", options: ["Keine besonderen Einschränkungen", "Ja"], conditional: { when: "Ja", label: "Was genau?" } },
        { id: "10.2", title: "Gibt es neben dem bestehenden Logo weitere visuelle Materialien oder Elemente, die unbedingt erhalten bleiben sollen?", type: "radio", options: ["Nein", "Ja"], conditional: { when: "Ja", label: "Welche?" } }
      ]
    },
    {
      id: "support", short: "Betreuung", title: "Laufende Betreuung", color: "#48A942", intro: "Nach aktuellem Verständnis umfasst die Betreuung die Website, Veranstaltungen, Nachrichten, Facebook, Instagram, Newsletter, Fotos, kleinere Änderungen und Vorschläge zur Weiterentwicklung des digitalen Auftritts von IBB.",
      questions: [
        { id: "11.1", title: "Gibt es etwas aus dieser Aufzählung, das nicht Teil der laufenden Betreuung sein soll?", type: "radio", options: ["Nein, die genannten Bereiche passen", "Ja, einzelne Aufgaben werden nicht benötigt"], conditional: { when: "Ja, einzelne Aufgaben werden nicht benötigt", label: "Welche Aufgaben werden nicht benötigt?" } },
        { id: "11.2", title: "Erwarten Sie weitere Aufgaben im Rahmen der laufenden Betreuung?", type: "radio", options: ["Nein", "Ja"], conditional: { when: "Ja", label: "Welche Aufgaben?" } },
        { id: "11.3", title: "Wie schnell sollen aktuelle Informationen nach Eingang beim Auftragnehmer normalerweise veröffentlicht werden?", type: "radio", options: ["Dringende Informationen möglichst noch am selben Tag", "In der Regel innerhalb von 1–2 Arbeitstagen", "In der Regel innerhalb weniger Arbeitstage", "Abhängig von der Art des Materials", "Wir wünschen einen Vorschlag für einen Standardablauf"] }
      ]
    },
    {
      id: "extra", short: "Ergänzungen", title: "Weitere Wünsche", color: "#6047B5", intro: "Im letzten Bereich ist Platz für alles Wichtige, das in den vorherigen Fragen noch nicht angesprochen wurde.",
      questions: [
        { id: "12.1", title: "Gibt es etwas Wichtiges für die neue Website oder die weitere digitale Betreuung, das wir bisher nicht besprochen haben?", type: "textarea", optional: true },
        { id: "12.2", title: "Gibt es Ideen, die derzeit noch nicht erforderlich sind, aber bei der späteren Weiterentwicklung berücksichtigt werden sollten?", type: "textarea", hint: "Zum Beispiel Funktionen oder Themenbereiche, die später relevant werden könnten.", optional: true }
      ]
    }
  ];

  window.QUESTIONNAIRE_DATA = { ui: ui, basis: basis, sections: sections };
}());
