# BLACKOUT HABILITATION V4 — chantier isolé
## État
V3 sur main non modifiée. Démonstrateur formateur: `v4/formateur.html` (ouvrir avec `core.js` dans le même dossier). Données uniquement fictives en mémoire, perdues au rechargement. Pas de stockage Drive ni d'envoi réel. Les grilles et la règle critique sont provisoires, à valider avec les documents PROMEO.
## Architecture cible
- Campagnes (année, classe, symboles, version de barème), apprentis et dossiers affectés par le formateur. ID dossier aléatoire stable distinct de l'ID d'une tentative de théorie. L'identité vient du dossier, jamais d'une recherche par nom.
- Théorie : V3 conserve sa banque, chronomètre et PDF. Nouveau mode connecté à construire : code individuel temporaire, tentative allouée côté serveur, soumission des réponses, calcul serveur, accusé de réception, reprise sur erreur réseau. Les scores clients ne sont jamais autoritatifs. La V3 publique contient actuellement les réponses dans le JavaScript : séparer banque de correction du navigateur pour un examen sécurisé.
- Pratique : grille par symbole et version, critères observables, criticité, barème, non observé et observations. Pas de compensation entre théorie et pratique; avis explicite du formateur. Ne pas attribuer de seuil définitif avant réception des grilles.
- Espace formateur : authentification professionnelle vérifiée côté serveur, droits par campagne, enregistrement des brouillons, historique de tentatives et révisions. Signature de chacun après présentation de la synthèse, horodatage serveur, gel de la version signée. Toute reprise crée une nouvelle version.
- Google Sheets : index de dossiers et statuts, sans signatures ni gros JSON dans les cellules. Drive professionnel privé : enregistrements JSON et PDF versionnés avec empreintes, sans partage public. Deux applications Apps Script : formateur restreinte à l'identité professionnelle autorisée, apprenti à jeton limité en lecture/écriture de sa propre tentative. Préférer HTML Service et google.script.run pour éviter les difficultés CORS. QR existant pourra pointer vers un portail public sans données personnelles qui redirige vers le mode connecté après validation. Vérifier la disponibilité de l'identité Workspace et les règles de déploiement; jamais d'autorisation fondée sur un identifiant transmis par le client.
- Finalisation : création PDF côté serveur à partir de la version gelée; signature manuscrite déclarative, acceptation administrative à confirmer; archivage, liste de destinataires autorisés, envoi idempotent par dossier/version, suivi des erreurs et relance ciblée.
## Vérifications indispensables avant production
Autorisation PROMEO, compte professionnel, politique de conservation, droits de diffusion de la banque et des images, sécurité des tentatives, contrôle d'accès négatif, test d'absence de double soumission, perte réseau, reprise, clôture, PDF et envoi. Aucun nom, score, jeton, signature ni secret dans le dépôt public.
## Tests du noyau exécutés lors de la création
- théorie en attente
- rattachement par dossier et campagne
- rejet du mauvais dossier
- rejet du doublon
- blocage avis favorable sur critère critique partiel
- avis possible si théorie et pratique complètes
- pas de compensation de la théorie
- dossier clôturé non modifiable
