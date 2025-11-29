# Politique de Confidentialité

**Date d'entrée en vigueur : 12 novembre 2025**

Chez Sting9, votre vie privée est notre priorité absolue. Nous nous engageons à protéger vos informations personnelles et à traiter les données de phishing soumises avec le plus grand soin.

---

## Nos Principes de Confidentialité

### 🔒 Confidentialité d'Abord
Toutes les soumissions sont automatiquement anonymisées. Aucune donnée personnelle n'est stockée.

### 👁️ Pas de Suivi
Nous ne suivons pas qui soumet les messages. Les contributions anonymes sont les bienvenues.

### 🌍 Conforme au RGPD
Nous respectons le RGPD, le CCPA et les réglementations internationales sur la confidentialité.

---

## 1. Qui Sommes-Nous

Sting9 Research Initiative est exploité par nlsio LLC (changement de statut prévu). Nous construisons le plus grand ensemble de données open-source au monde de messages de phishing et smishing pour entraîner des modèles d'IA à détecter les communications malveillantes.

**Contact :** [hello@sting9.org](mailto:hello@sting9.org)
**Délégué à la Protection des Données :** [privacy@sting9.org](mailto:privacy@sting9.org)

---

## 2. Informations que Nous Collectons

### 2.1 Messages de Phishing/Escroquerie Soumis

Lorsque vous soumettez un message suspect à Sting9, nous collectons :

- **Contenu du Message** : Le texte complet de l'e-mail, SMS ou autre message (automatiquement anonymisé avant stockage)
- **Métadonnées du Message** : Lignes d'objet, horodatages, domaines d'expéditeur (mais PAS les adresses e-mail complètes ni les numéros de téléphone)
- **En-têtes du Message** : Informations techniques de routage avec identifiants personnels supprimés
- **Type de Message** : S'il s'agit d'un e-mail, SMS, WhatsApp, Telegram, Signal ou autre format
- **Source de Soumission** : Comment le message a été soumis (formulaire web, transfert d'e-mail, API, partenaire)
- **Langue Détectée** : La langue du contenu du message

> **✓ IMPORTANT :** Toutes les informations personnellement identifiables (PII) sont automatiquement expurgées AVANT le stockage.
>
> Cela inclut : adresses e-mail, numéros de téléphone, noms, adresses postales, numéros de carte de crédit, numéros de sécurité sociale, adresses IP et toute autre information identifiable.

### 2.2 Données d'Utilisation du Site Web

Nous collectons un minimum de données techniques pour exploiter notre site web :

- Journaux serveur de base (horodatages, requêtes HTTP) - conservés 30 jours
- Journaux d'erreurs pour le débogage - conservés 90 jours
- Pas de cookies, pixels de suivi ou outils d'analyse
- Pas de publicité ou suivi tiers

### 2.3 Informations que Nous NE Collectons PAS

Nous ne collectons ni ne conservons explicitement :

- Votre identité ou coordonnées (sauf si vous les fournissez explicitement pour des demandes de partenariat)
- Adresses IP des visiteurs ou des personnes soumettant des messages
- Empreintes d'appareil ou identifiants de suivi
- Historique de navigation ou données comportementales
- Toute information personnelle des messages de phishing que vous soumettez

---

## 3. Comment Nous Utilisons Vos Informations

### 3.1 Messages Soumis

Les données de messages anonymisées sont utilisées pour :

- Construire et entraîner des modèles d'IA pour la détection de phishing
- Créer un ensemble de données open-source pour les chercheurs en sécurité
- Analyser les schémas et tendances d'attaque
- Améliorer nos algorithmes de détection
- Générer des statistiques publiques sur les menaces de phishing

### 3.2 Données Techniques

Les données techniques de base sont utilisées uniquement pour :

- Exploiter et maintenir notre site web
- Déboguer les problèmes techniques
- Prévenir les abus et assurer la sécurité
- Respecter les obligations légales

---

## 4. Stockage et Sécurité des Données

### Hébergement des Données

Toutes les données sont hébergées sur l'infrastructure Upsun dans la région Suisse, bénéficiant des lois strictes de la Suisse sur la protection des données.

### Mesures de Sécurité :

- **Chiffrement** : Toutes les données sont chiffrées en transit (TLS 1.3) et au repos
- **Expurgation Automatique des PII** : Les informations personnelles sont supprimées avant le stockage en base de données en utilisant des expressions régulières et la NER (Reconnaissance d'Entités Nommées)
- **Contrôles d'Accès** : Sécurité au niveau des lignes stricte et accès basé sur les rôles dans PostgreSQL
- **Journalisation d'Audit** : Tous les accès aux données sont journalisés et surveillés
- **Sauvegardes Régulières** : Sauvegardes chiffrées automatisées avec conservation de 30 jours
- **Mises à Jour de Sécurité** : Correctifs de sécurité réguliers et analyse des vulnérabilités

---

## 5. Partage et Divulgation des Données

### 5.1 Ensemble de Données Ouvert

Les données de messages anonymisées sont rendues publiquement disponibles sous la licence ODC-BY-NC pour :

- Chercheurs académiques
- Professionnels de la sécurité
- Organisations à but non lucratif
- Établissements d'enseignement

### 5.2 Pas de Vente de Données

**Nous NE vendons PAS et NE vendrons JAMAIS vos informations personnelles ou les données de phishing que vous soumettez.**

### 5.3 Exigences Légales

Nous pouvons divulguer des informations uniquement si la loi l'exige, sur ordonnance d'un tribunal, ou pour protéger nos droits légaux. Cependant, comme nous ne collectons pas d'informations personnelles, il y a peu de données à divulguer.

---

## 6. Vos Droits en Matière de Confidentialité

En vertu du RGPD, du CCPA et d'autres lois sur la confidentialité, vous avez le droit de :

- **Accès** : Demander des informations sur les données que nous pourrions avoir (bien que nous ne lions pas les données aux identités)
- **Suppression** : Demander la suppression de soumissions spécifiques (si vous pouvez les identifier)
- **Portabilité** : Exporter les données dans un format lisible par machine
- **Opposition** : Vous opposer au traitement de vos données
- **Rectification** : Demander la correction de données inexactes

### Pour Exercer Vos Droits :

E-mail : [privacy@sting9.org](mailto:privacy@sting9.org)

**Remarque :** Comme les soumissions sont anonymes, vous devrez peut-être fournir l'identifiant de soumission pour identifier des données spécifiques.

---

## 7. Conservation des Données

- **Messages Anonymisés** : Conservés indéfiniment à des fins de recherche (car ils ne contiennent aucune information personnelle)
- **Journaux Serveur** : 30 jours
- **Journaux d'Erreurs** : 90 jours
- **Données de Sauvegarde** : 30 jours

---

## 8. Transferts Internationaux de Données

Nos données sont hébergées en Suisse et ne sont pas transférées hors de Suisse, sauf lorsqu'elles sont consultées via notre API par des chercheurs autorisés dans le monde entier. Comme toutes les données sont anonymisées, les transferts internationaux ne présentent pas de risques pour la vie privée.

---

## 9. Confidentialité des Enfants

Notre service ne s'adresse pas aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants. Si vous pensez qu'un enfant a soumis des informations personnelles, veuillez nous contacter à [privacy@sting9.org](mailto:privacy@sting9.org).

---

## 10. Modifications de cette Politique

Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous informerons les utilisateurs des modifications importantes en :

- Publiant la politique mise à jour sur cette page
- Mettant à jour la « Date d'entrée en vigueur » en haut
- Envoyant un avis aux partenaires enregistrés (le cas échéant)

---

## Nous Contacter

Si vous avez des questions sur cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter :

**Questions Générales :** [hello@sting9.org](mailto:hello@sting9.org)
**Responsable de la Confidentialité :** [privacy@sting9.org](mailto:privacy@sting9.org)

Sting9 Research Initiative
Exploité par nlsio LLC
