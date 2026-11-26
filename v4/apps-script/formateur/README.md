# Adaptateur privé formateur — non déployé
Première brique : initialisation de l'index, création, lecture, liste de dossiers privés. Tous les appels publics exigent BLACKOUT_ENABLED=YES ET une identité Google active autorisée, sans recours à l'identité effective. Le déploiement initial devra être limité au seul utilisateur, avec compte professionnel autorisé. Aucun compte ni identifiant réel configuré ici.

Propriétés privées du projet Apps Script (ne jamais committer leurs valeurs) :
- BLACKOUT_ENABLED (absent par défaut)
- BLACKOUT_TRAINERS (liste d'adresses autorisées)
- BLACKOUT_SHEET_ID (classeur privé)
- BLACKOUT_FOLDER_ID (dossier Drive privé)

Ce code ne contient pas encore de point d'entrée Web, de soumission apprenti, de sauvegarde de grille, de signature définitive ni d'envoi. Il s'agit d'une bibliothèque de départ, pas d'un service utilisable. L'interface de démonstration ne s'y connecte pas encore.
Avant activation : contrôler droits et héritages du dossier, tester avec utilisateur interdit et identité vide, assurer politique de conservation/suppression, valider stockage et verrouillage concurrents et prévoir journal de révisions. L'index utilise un ID stable par dossier; les détails complets ne sont pas placés dans les cellules. La création de chaque fichier doit se faire uniquement dans le dossier professionnel autorisé.