# Sicherheit

## Schutz der Nutzer vor Phishing und Schutz unserer Plattform vor Missbrauch

Sicherheit steht im Mittelpunkt von allem, was wir tun. Erfahren Sie, wie Sie sich vor Phishing schützen können und wie wir die Sting9-Plattform sichern.

---

## Schnelle Statistiken

| Statistik | Auswirkung |
|-----------|------------|
| **5,3 Mrd.** | Phishing-E-Mails täglich versendet |
| **10,3 Mrd. $** | Jährlich durch Betrug verloren |
| **1 von 3** | Personen fallen auf Phishing herein |
| **87%** | Smishing-Angriffe umgehen Filter |

---

## Schützen Sie sich vor Phishing

Erfahren Sie, wie Sie Phishing-, Smishing- und Betrugsversuche erkennen und vermeiden.

### Wie man Phishing erkennt

#### Warnzeichen in E-Mails

- **Dringende oder bedrohliche Sprache:** „Ihr Konto wird geschlossen!", „Sofortiges Handeln erforderlich!"
- **Verdächtige Absenderadressen:** paypal-secure@service-verify.com statt @paypal.com
- **Allgemeine Begrüßungen:** „Sehr geehrter Kunde" statt Ihres tatsächlichen Namens
- **Verdächtige Links:** Fahren Sie mit der Maus über Links, um zu sehen, wohin sie wirklich führen (nicht klicken!)
- **Unerwartete Anhänge:** Besonders .exe-, .zip- oder .doc-Dateien, die Sie nicht erwartet haben
- **Schlechte Grammatik und Rechtschreibung:** Professionelle Unternehmen korrekturlesen ihre E-Mails
- **Anfragen nach sensiblen Informationen:** Seriöse Unternehmen fragen niemals per E-Mail nach Passwörtern

#### Warnzeichen in Textnachrichten (Smishing)

- **Unbekannte Absender:** Nachrichten von Nummern, die Sie nicht kennen und die behaupten, Ihre Bank zu sein
- **Verkürzte URLs:** bit.ly-, tinyurl.com-Links, die das echte Ziel verbergen
- **Gewinn- oder Lotteriebenachrichtigungen:** „Herzlichen Glückwunsch! Sie haben gewonnen!" (Sie haben an nichts teilgenommen)
- **Zustellbenachrichtigungen:** Gefälschte UPS/FedEx/Amazon-Nachrichten, wenn Sie nichts bestellt haben
- **Kontoverifizierungsanfragen:** „Klicken Sie hier, um Ihr Konto zu verifizieren" von Diensten, die Sie nicht nutzen

### Was zu tun ist, wenn Sie eine verdächtige Nachricht erhalten

1. **Klicken Sie auf keine Links und laden Sie keine Anhänge herunter**
   - Selbst das Überfahren mit der Maus kann in manchen Kontexten bösartige Skripte auslösen

2. **Unabhängig verifizieren**
   - Kontaktieren Sie das Unternehmen direkt über dessen offizielle Website oder Telefonnummer (nicht die in der Nachricht)

3. **Melden Sie es an Sting9**
   - Senden Sie die Nachricht an uns unter [sting9.org/submit](/submit) oder leiten Sie sie weiter an [submit@sting9.org](mailto:submit@sting9.org)

4. **Löschen Sie die Nachricht**
   - Entfernen Sie sie aus Ihrem Posteingang oder Telefon, um versehentliches Klicken später zu vermeiden

5. **Warnen Sie andere**
   - Wenn es sich um einen weit verbreiteten Betrug handelt, alarmieren Sie Freunde, Familie und Kollegen

### Best Practices für Sicherheit

#### E-Mail-Sicherheit

- ✓ Aktivieren Sie die Zwei-Faktor-Authentifizierung (2FA)
- ✓ Verwenden Sie starke, eindeutige Passwörter
- ✓ Halten Sie Software und Antivirenprogramme aktuell
- ✓ Verwenden Sie einen Passwort-Manager

#### Mobile Sicherheit

- ✓ Antworten Sie nicht auf unbekannte Textnachrichten
- ✓ Überprüfen Sie den Absender, bevor Sie auf SMS-Links klicken
- ✓ Aktivieren Sie die Spam-Filterung auf Ihrem Telefon
- ✓ Halten Sie Ihr Betriebssystem und Ihre Apps aktuell

---

## Wie wir Sting9 sichern

Unser Engagement für den Schutz Ihrer Privatsphäre und die Sicherung der Plattform.

### Infrastruktursicherheit

- **Schweizer Hosting:** Alle Daten werden auf Upsun-Infrastruktur in der Schweiz gehostet und profitieren von strengen Datenschutzgesetzen
- **Verschlüsselung während der Übertragung:** TLS 1.3-Verschlüsselung für alle Verbindungen (nur HTTPS, kein HTTP)
- **Verschlüsselung im Ruhezustand:** PostgreSQL-Datenbank mit vollständiger Festplattenverschlüsselung und verschlüsselten Backups
- **Netzwerksicherheit:** Firewall-Schutz, DDoS-Mitigation und Intrusion-Detection-Systeme
- **Regelmäßige Backups:** Automatisierte verschlüsselte Backups mit 30-Tage-Aufbewahrung und Point-in-Time-Wiederherstellung

### Anwendungssicherheit

- **Automatische PII-Schwärzung:** Alle eingereichten Nachrichten durchlaufen vor der Speicherung eine Anonymisierungs-Pipeline (E-Mails, Telefonnummern, Namen, Adressen, SSNs, Kreditkarten, IPs)
- **SQL-Injection-Prävention:** Parametrisierte Abfragen mit sqlc (typsicher, nur vorbereitete Anweisungen)
- **Eingabevalidierung:** Strikte Validierung aller Benutzereingaben mit Go's Validator-Bibliothek
- **Rate Limiting:** Verhindert Missbrauch von Einreichungs-Endpunkten und API-Flooding
- **CORS-Schutz:** Strikte Ursprungsprüfung zur Verhinderung unbefugter Cross-Origin-Anfragen
- **Content Security Policy:** Verhindert XSS-Angriffe und unbefugte Skript-Ausführung
- **Sichere Datei-Uploads:** Dateitypvalidierung, Größenbeschränkungen und Malware-Scanning

### Zugriffskontrolle & Authentifizierung

- **JWT-Authentifizierung:** Sichere token-basierte Authentifizierung für Forscher- und Partner-API-Zugriff
- **Passwort-Sicherheit:** Bcrypt-Hashing mit hohem Kostenfaktor für alle gespeicherten Passwörter
- **Row-Level Security:** PostgreSQL RLS-Richtlinien stellen sicher, dass Benutzer nur auf autorisierte Daten zugreifen können
- **Audit-Protokollierung:** Alle Datenzugriffe und -änderungen werden mit Zeitstempeln und Benutzer-IDs protokolliert
- **Prinzip der geringsten Privilegien:** Datenbankbenutzer und API-Rollen haben minimale erforderliche Berechtigungen

### Überwachung & Incident Response

- **24/7-Überwachung:** Automatisierte Überwachung von Infrastruktur, Anwendung und Sicherheitsereignissen
- **Sicherheitsscans:** Regelmäßige Schwachstellenscans mit automatisierten und manuellen Penetrationstests
- **Dependency-Updates:** Automatisierte Sicherheitspatches und Verfolgung von Abhängigkeitsschwachstellen (Dependabot/Snyk)
- **Incident-Response-Plan:** Dokumentierte Verfahren für Sicherheitsvorfälle mit definierten Eskalationspfaden
- **Benachrichtigung bei Datenpannen:** Verpflichtung, betroffene Parteien innerhalb von 72 Stunden nach bestätigter Panne zu benachrichtigen

---

## Richtlinie für verantwortungsvolle Offenlegung

Wir nehmen Sicherheitslücken ernst und schätzen die Bemühungen der Sicherheitsforschungs-Community, Sting9 und unsere Benutzer sicher zu halten. Wenn Sie eine Sicherheitslücke entdecken, folgen Sie bitte unserem Prozess für verantwortungsvolle Offenlegung.

> **⚠ Richtlinien für verantwortungsvolle Offenlegung**
>
> Bitte melden Sie Schwachstellen privat an unser Sicherheitsteam. Veröffentlichen Sie NICHT öffentlich, bis wir Zeit hatten, das Problem zu beheben. Wir verpflichten uns, innerhalb von 48 Stunden zu antworten.

### Wie man eine Sicherheitslücke meldet

1. **E-Mail an unser Sicherheitsteam:**
   - [security@sting9.org](mailto:security@sting9.org) (PGP-Schlüssel auf Anfrage verfügbar)

2. **Detaillierte Informationen einschließen:**
   - Beschreibung der Schwachstelle
   - Schritte zur Reproduktion des Problems
   - Potenzielle Auswirkungen und Schweregrad
   - Proof-of-Concept-Code oder Screenshots
   - Ihre Kontaktinformationen für Rückfragen

3. **Auf unsere Antwort warten:**
   - Wir bestätigen den Empfang innerhalb von 48 Stunden und geben einen Zeitplan für die Lösung an

### Unser Versprechen

- ✓ Bestätigen Sie Ihren Bericht innerhalb von 48 Stunden
- ✓ Halten Sie Sie über unseren Fortschritt auf dem Laufenden
- ✓ Nennen Sie Sie in unseren Sicherheitsanerkennungen (falls gewünscht)
- ✓ Arbeiten Sie mit Ihnen zusammen, um das Problem zu verstehen und zu beheben
- ✓ Keine rechtlichen Schritte gegen gutgläubige Sicherheitsforscher einleiten

### Geltungsbereich

**Im Geltungsbereich:**
- sting9.org Website
- api.sting9.org API
- submit@sting9.org E-Mail-Endpunkt
- Authentifizierungssysteme
- Datenverarbeitungs-Pipelines

**Außerhalb des Geltungsbereichs:**
- Social-Engineering-Angriffe
- Physische Sicherheit
- DoS/DDoS-Angriffe
- Dienste Dritter
- Spam- oder Inhaltsprobleme

### Hall of Fame

Sicherheitsforscher, die Schwachstellen verantwortungsvoll offenlegen, werden auf unserer Security Hall of Fame-Seite anerkannt (demnächst verfügbar). Vielen Dank, dass Sie helfen, Sting9 sicher zu halten!

---

## Sicherheitskontakt

Für Sicherheitsbedenken, Schwachstellenmeldungen oder Fragen zu unseren Sicherheitspraktiken:

**Sicherheitsteam:** [security@sting9.org](mailto:security@sting9.org)
**Allgemeine Anfragen:** [hello@sting9.org](mailto:hello@sting9.org)

*PGP-Öffentlicher Schlüssel auf Anfrage für verschlüsselte Kommunikation verfügbar*
