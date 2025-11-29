# Sécurité

## Protéger les utilisateurs du phishing et protéger notre plateforme contre les abus

La sécurité est au cœur de tout ce que nous faisons. Apprenez à vous protéger du phishing et comment nous sécurisons la plateforme Sting9.

---

## Statistiques Rapides

| Statistique | Impact |
|-------------|--------|
| **5,3 Mrd.** | E-mails de phishing envoyés quotidiennement |
| **10,3 Mrd. $** | Perdus à cause des escroqueries annuellement |
| **1 sur 3** | Personnes tombent dans le piège du phishing |
| **87%** | Attaques de smishing contournent les filtres |

---

## Se Protéger du Phishing

Apprenez à identifier et éviter les tentatives de phishing, smishing et d'escroquerie.

### Comment Repérer le Phishing

#### Signaux d'Alarme dans les E-mails

- **Langage urgent ou menaçant :** « Votre compte sera fermé ! », « Action immédiate requise ! »
- **Adresses d'expéditeur suspectes :** paypal-secure@service-verify.com au lieu de @paypal.com
- **Salutations génériques :** « Cher Client » au lieu de votre nom réel
- **Liens suspects :** Survolez les liens pour voir où ils mènent vraiment (ne cliquez pas !)
- **Pièces jointes inattendues :** Surtout les fichiers .exe, .zip ou .doc que vous n'attendiez pas
- **Grammaire et orthographe médiocres :** Les entreprises professionnelles relisent leurs e-mails
- **Demandes d'informations sensibles :** Les entreprises légitimes ne demandent jamais de mots de passe par e-mail

#### Signaux d'Alarme dans les Messages Texte (Smishing)

- **Expéditeurs inconnus :** Messages de numéros que vous ne reconnaissez pas prétendant être votre banque
- **URLs raccourcies :** Liens bit.ly, tinyurl.com qui cachent la vraie destination
- **Notifications de prix ou de loterie :** « Félicitations ! Vous avez gagné ! » (vous n'avez participé à rien)
- **Notifications de livraison :** Faux messages UPS/FedEx/Amazon alors que vous n'avez rien commandé
- **Demandes de vérification de compte :** « Cliquez ici pour vérifier votre compte » de services que vous n'utilisez pas

### Que Faire si Vous Recevez un Message Suspect

1. **Ne cliquez sur aucun lien et ne téléchargez aucune pièce jointe**
   - Même survoler peut parfois déclencher des scripts malveillants dans certains contextes

2. **Vérifiez indépendamment**
   - Contactez l'entreprise directement via leur site web officiel ou numéro de téléphone (pas celui du message)

3. **Signalez-le à Sting9**
   - Soumettez le message sur [sting9.org/submit](/submit) ou transférez-le à [submit@sting9.org](mailto:submit@sting9.org)

4. **Supprimez le message**
   - Retirez-le de votre boîte de réception ou téléphone pour éviter de cliquer accidentellement plus tard

5. **Avertissez les autres**
   - S'il s'agit d'une escroquerie répandue, alertez amis, famille et collègues

### Meilleures Pratiques de Sécurité

#### Sécurité des E-mails

- ✓ Activez l'authentification à deux facteurs (2FA)
- ✓ Utilisez des mots de passe forts et uniques
- ✓ Maintenez les logiciels et antivirus à jour
- ✓ Utilisez un gestionnaire de mots de passe

#### Sécurité Mobile

- ✓ Ne répondez pas aux messages texte inconnus
- ✓ Vérifiez l'expéditeur avant de cliquer sur les liens SMS
- ✓ Activez le filtrage anti-spam sur votre téléphone
- ✓ Maintenez votre système d'exploitation et applications à jour

---

## Comment Nous Sécurisons Sting9

Notre engagement à protéger votre vie privée et sécuriser la plateforme.

### Sécurité de l'Infrastructure

- **Hébergement Suisse :** Toutes les données hébergées sur l'infrastructure Upsun en Suisse, bénéficiant de lois strictes sur la protection des données
- **Chiffrement en Transit :** Chiffrement TLS 1.3 pour toutes les connexions (HTTPS uniquement, pas de HTTP)
- **Chiffrement au Repos :** Base de données PostgreSQL avec chiffrement complet du disque et sauvegardes chiffrées
- **Sécurité Réseau :** Protection pare-feu, atténuation DDoS et systèmes de détection d'intrusion
- **Sauvegardes Régulières :** Sauvegardes chiffrées automatisées avec rétention de 30 jours et récupération à un instant donné

### Sécurité des Applications

- **Expurgation Automatique des PII :** Tous les messages soumis passent par un pipeline d'anonymisation avant stockage (e-mails, numéros de téléphone, noms, adresses, SSN, cartes de crédit, IP)
- **Prévention des Injections SQL :** Requêtes paramétrées avec sqlc (sûres au niveau des types, instructions préparées uniquement)
- **Validation des Entrées :** Validation stricte de toutes les entrées utilisateur avec la bibliothèque validator de Go
- **Limitation de Débit :** Empêche l'abus des points de terminaison de soumission et le flooding de l'API
- **Protection CORS :** Vérification stricte de l'origine pour empêcher les requêtes cross-origin non autorisées
- **Politique de Sécurité du Contenu :** Empêche les attaques XSS et l'exécution de scripts non autorisés
- **Téléchargements de Fichiers Sécurisés :** Validation du type de fichier, limites de taille et analyse de malware

### Contrôle d'Accès & Authentification

- **Authentification JWT :** Authentification sécurisée basée sur des jetons pour l'accès API des chercheurs et partenaires
- **Sécurité des Mots de Passe :** Hachage Bcrypt avec facteur de coût élevé pour tous les mots de passe stockés
- **Sécurité au Niveau des Lignes :** Les politiques RLS PostgreSQL garantissent que les utilisateurs ne peuvent accéder qu'aux données autorisées
- **Journalisation d'Audit :** Tous les accès et modifications de données sont enregistrés avec horodatages et ID utilisateur
- **Principe du Moindre Privilège :** Les utilisateurs de base de données et rôles API ont les permissions minimales requises

### Surveillance & Réponse aux Incidents

- **Surveillance 24/7 :** Surveillance automatisée de l'infrastructure, de l'application et des événements de sécurité
- **Analyse de Sécurité :** Analyses régulières des vulnérabilités avec tests de pénétration automatisés et manuels
- **Mises à Jour des Dépendances :** Correctifs de sécurité automatisés et suivi des vulnérabilités des dépendances (Dependabot/Snyk)
- **Plan de Réponse aux Incidents :** Procédures documentées pour les incidents de sécurité avec chemins d'escalade définis
- **Notification de Violation :** Engagement à notifier les parties affectées dans les 72 heures suivant une violation confirmée

---

## Politique de Divulgation Responsable

Nous prenons les vulnérabilités de sécurité au sérieux et apprécions les efforts de la communauté de recherche en sécurité pour aider à maintenir Sting9 et nos utilisateurs en sécurité. Si vous découvrez une vulnérabilité de sécurité, veuillez suivre notre processus de divulgation responsable.

> **⚠ Directives de Divulgation Responsable**
>
> Veuillez signaler les vulnérabilités en privé à notre équipe de sécurité. Ne divulguez PAS publiquement avant que nous ayons eu le temps de résoudre le problème. Nous nous engageons à répondre dans les 48 heures.

### Comment Signaler une Vulnérabilité de Sécurité

1. **E-mail à notre équipe de sécurité :**
   - [security@sting9.org](mailto:security@sting9.org) (clé PGP disponible sur demande)

2. **Inclure des informations détaillées :**
   - Description de la vulnérabilité
   - Étapes pour reproduire le problème
   - Impact potentiel et gravité
   - Tout code de preuve de concept ou captures d'écran
   - Vos coordonnées pour le suivi

3. **Attendre notre réponse :**
   - Nous accuserons réception dans les 48 heures et fournirons un calendrier de résolution

### Notre Promesse

- ✓ Accuser réception de votre rapport dans les 48 heures
- ✓ Vous tenir informé de nos progrès
- ✓ Vous créditer dans nos remerciements de sécurité (si désiré)
- ✓ Travailler avec vous pour comprendre et résoudre le problème
- ✓ Ne pas poursuivre en justice les chercheurs en sécurité de bonne foi

### Portée

**Dans la Portée :**
- Site web sting9.org
- API api.sting9.org
- Point de terminaison e-mail submit@sting9.org
- Systèmes d'authentification
- Pipelines de traitement des données

**Hors de Portée :**
- Attaques d'ingénierie sociale
- Sécurité physique
- Attaques DoS/DDoS
- Services tiers
- Problèmes de spam ou de contenu

### Hall of Fame

Les chercheurs en sécurité qui divulguent de manière responsable les vulnérabilités seront reconnus sur notre page Security Hall of Fame (bientôt disponible). Merci d'aider à maintenir Sting9 sécurisé !

---

## Contact Sécurité

Pour les préoccupations de sécurité, les rapports de vulnérabilités ou les questions sur nos pratiques de sécurité :

**Équipe de Sécurité :** [security@sting9.org](mailto:security@sting9.org)
**Demandes Générales :** [hello@sting9.org](mailto:hello@sting9.org)

*Clé publique PGP disponible sur demande pour les communications chiffrées*
