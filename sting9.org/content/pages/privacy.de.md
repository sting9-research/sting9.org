# Datenschutzrichtlinie

**Gültig ab: 12. November 2025**

Bei Sting9 hat Ihre Privatsphäre höchste Priorität. Wir sind dem Schutz Ihrer persönlichen Daten und dem sorgfältigen Umgang mit eingereichten Phishing-Daten verpflichtet.

---

## Unsere Datenschutzprinzipien

### 🔒 Datenschutz zuerst
Alle Einreichungen werden automatisch anonymisiert. Keine persönlichen Daten werden gespeichert.

### 👁️ Keine Verfolgung
Wir verfolgen nicht, wer Nachrichten einreicht. Anonyme Beiträge sind willkommen.

### 🌍 DSGVO-konform
Wir entsprechen der DSGVO, CCPA und internationalen Datenschutzvorschriften.

---

## 1. Wer wir sind

Die Sting9 Forschungsinitiative wird von nlsio LLC (Statusänderung geplant) betrieben. Wir erstellen den weltweit umfassendsten Open-Source-Datensatz von Phishing- und Smishing-Nachrichten, um KI-Modelle zur Erkennung bösartiger Kommunikation zu trainieren.

**Kontakt:** [hello@sting9.org](mailto:hello@sting9.org)
**Datenschutzbeauftragter:** [privacy@sting9.org](mailto:privacy@sting9.org)

---

## 2. Welche Informationen wir sammeln

### 2.1 Eingereichte Phishing/Betrugsnachrichten

Wenn Sie eine verdächtige Nachricht bei Sting9 einreichen, sammeln wir:

- **Nachrichteninhalt**: Der vollständige Text der E-Mail, SMS oder anderen Nachricht (vor der Speicherung automatisch anonymisiert)
- **Nachrichtenmetadaten**: Betreffzeilen, Zeitstempel, Absenderdomänen (aber NICHT vollständige E-Mail-Adressen oder Telefonnummern)
- **Nachrichtenheader**: Technische Routing-Informationen mit entfernten persönlichen Identifikatoren
- **Nachrichtentyp**: Ob es sich um eine E-Mail, SMS, WhatsApp, Telegram, Signal oder anderes Format handelt
- **Einreichungsquelle**: Wie die Nachricht eingereicht wurde (Webformular, E-Mail-Weiterleitung, API, Partner)
- **Erkannte Sprache**: Die Sprache des Nachrichteninhalts

> **✓ WICHTIG:** Alle personenbezogenen Daten (PII) werden VOR der Speicherung automatisch geschwärzt.
>
> Dies umfasst: E-Mail-Adressen, Telefonnummern, Namen, Straßenadressen, Kreditkartennummern, Sozialversicherungsnummern, IP-Adressen und alle anderen identifizierbaren Informationen.

### 2.2 Website-Nutzungsdaten

Wir sammeln minimale technische Daten zum Betrieb unserer Website:

- Grundlegende Serverprotokolle (Zeitstempel, HTTP-Anfragen) - 30 Tage aufbewahrt
- Fehlerprotokolle zur Fehlerbehebung - 90 Tage aufbewahrt
- Keine Cookies, Tracking-Pixel oder Analysetools
- Keine Werbung oder Tracking von Drittanbietern

### 2.3 Informationen, die wir NICHT sammeln

Wir sammeln oder speichern ausdrücklich NICHT:

- Ihre Identität oder Kontaktinformationen (es sei denn, Sie geben sie ausdrücklich für Partnerschaftsanfragen an)
- IP-Adressen von Website-Besuchern oder Einreichenden
- Geräte-Fingerabdrücke oder Tracking-Identifikatoren
- Browserverlauf oder Verhaltensdaten
- Persönliche Informationen aus den Phishing-Nachrichten, die Sie einreichen

---

## 3. Wie wir Ihre Informationen verwenden

### 3.1 Eingereichte Nachrichten

Anonymisierte Nachrichtendaten werden verwendet für:

- Aufbau und Training von KI-Modellen zur Phishing-Erkennung
- Erstellung eines Open-Source-Datensatzes für Sicherheitsforscher
- Analyse von Angriffsmustern und Trends
- Verbesserung unserer Erkennungsalgorithmen
- Generierung öffentlicher Statistiken über Phishing-Bedrohungen

### 3.2 Technische Daten

Grundlegende technische Daten werden nur verwendet für:

- Betrieb und Wartung unserer Website
- Behebung technischer Probleme
- Verhinderung von Missbrauch und Gewährleistung der Sicherheit
- Einhaltung gesetzlicher Verpflichtungen

---

## 4. Datenspeicherung und Sicherheit

### Datenhosting

Alle Daten werden auf Upsun-Infrastruktur in der Schweiz gehostet und profitieren von den starken Schweizer Datenschutzgesetzen.

### Sicherheitsmaßnahmen:

- **Verschlüsselung**: Alle Daten werden während der Übertragung (TLS 1.3) und im Ruhezustand verschlüsselt
- **Automatische PII-Schwärzung**: Persönliche Informationen werden vor der Datenbankspeicherung mittels Regex-Mustern und NER (Named Entity Recognition) entfernt
- **Zugriffskontrollen**: Strenge zeilenbasierte Sicherheit und rollenbasierter Zugriff in PostgreSQL
- **Audit-Protokollierung**: Alle Datenzugriffe werden protokolliert und überwacht
- **Regelmäßige Backups**: Automatisierte verschlüsselte Backups mit 30-tägiger Aufbewahrung
- **Sicherheitsupdates**: Regelmäßige Sicherheitspatches und Schwachstellenscans

---

## 5. Datenweitergabe und Offenlegung

### 5.1 Offener Datensatz

Anonymisierte Nachrichtendaten werden unter der ODC-BY-NC-Lizenz öffentlich verfügbar gemacht für:

- Akademische Forscher
- Sicherheitsexperten
- Gemeinnützige Organisationen
- Bildungseinrichtungen

### 5.2 Kein Verkauf von Daten

**Wir verkaufen NICHT und werden NIEMALS Ihre persönlichen Informationen oder die von Ihnen eingereichten Phishing-Daten verkaufen.**

### 5.3 Gesetzliche Anforderungen

Wir können Informationen nur offenlegen, wenn dies gesetzlich vorgeschrieben ist, durch Gerichtsbeschluss oder zum Schutz unserer Rechte. Da wir jedoch keine persönlichen Informationen sammeln, gibt es nur minimale Daten zur Offenlegung.

---

## 6. Ihre Datenschutzrechte

Nach DSGVO, CCPA und anderen Datenschutzgesetzen haben Sie das Recht auf:

- **Zugang**: Anforderung von Informationen über Daten, die wir möglicherweise haben (obwohl wir Daten nicht mit Identitäten verknüpfen)
- **Löschung**: Anforderung der Löschung bestimmter Einreichungen (wenn Sie diese identifizieren können)
- **Übertragbarkeit**: Export von Daten in maschinenlesbarem Format
- **Widerspruch**: Widerspruch gegen die Verarbeitung Ihrer Daten
- **Berichtigung**: Anforderung der Korrektur ungenauer Daten

### Zur Ausübung Ihrer Rechte:

E-Mail: [privacy@sting9.org](mailto:privacy@sting9.org)

**Hinweis:** Da Einreichungen anonym sind, müssen Sie möglicherweise die Einreichungs-ID angeben, um bestimmte Daten zu identifizieren.

---

## 7. Datenaufbewahrung

- **Anonymisierte Nachrichten**: Unbefristet für Forschungszwecke aufbewahrt (da sie keine persönlichen Informationen enthalten)
- **Serverprotokolle**: 30 Tage
- **Fehlerprotokolle**: 90 Tage
- **Backup-Daten**: 30 Tage

---

## 8. Internationale Datenübertragungen

Unsere Daten werden in der Schweiz gehostet und außerhalb der Schweiz nicht übertragen, außer wenn sie über unsere API von autorisierten Forschern weltweit abgerufen werden. Da alle Daten anonymisiert sind, stellen internationale Übertragungen keine Datenschutzrisiken dar.

---

## 9. Datenschutz für Kinder

Unser Dienst richtet sich nicht an Kinder unter 13 Jahren. Wir sammeln wissentlich keine persönlichen Informationen von Kindern. Wenn Sie glauben, dass ein Kind persönliche Informationen eingereicht hat, kontaktieren Sie uns bitte unter [privacy@sting9.org](mailto:privacy@sting9.org).

---

## 10. Änderungen dieser Richtlinie

Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Benutzer über wesentliche Änderungen informieren durch:

- Veröffentlichung der aktualisierten Richtlinie auf dieser Seite
- Aktualisierung des "Gültig ab"-Datums oben
- Benachrichtigung an registrierte Partner (falls zutreffend)

---

## Kontaktieren Sie uns

Wenn Sie Fragen zu dieser Datenschutzrichtlinie oder unseren Datenpraktiken haben, kontaktieren Sie uns bitte:

**Allgemeine Anfragen:** [hello@sting9.org](mailto:hello@sting9.org)
**Datenschutzbeauftragter:** [privacy@sting9.org](mailto:privacy@sting9.org)

Sting9 Forschungsinitiative
Betrieben von nlsio LLC
