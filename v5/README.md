# BLACKOUT HABILITATION — V5 pilote

Deux liens GitHub Pages autonomes (aucune donnée nominative stockée dans GitHub) :

- Apprenti : `/v5/theorie.html`
- Formateur : `/v5/formateur.html`

La théorie propose 15 questions par parcours (5 dangers/protections, 5 zones/distances, 5 limites), un chronomètre de 20 minutes par parcours, un PDF détaillé et des métadonnées de transfert. Le formateur importe le PDF et recalcule les résultats. Les métadonnées ne sont PAS signées. Les PDF externes peuvent être importés et saisis manuellement. Le formateur sélectionne les symboles et renseigne les grilles, les observations, et l'avis individuel. Un avis favorable est bloqué si théorie non positive/non contrôlée, identité discordante, grille incomplète, plus de deux erreurs mineures ou au moins une majeure. Le dossier final est un avis après formation à vérifier et signer, avec le PDF de théorie original en annexe. Ce n'est pas un titre d'habilitation, qui relève de l'employeur.

## Limites et validation préalable
- Banque et grilles V5 en version pilote, non certifiées : faire valider les formulations et les corrigés par le référent habilitation et par rapport au référentiel applicable. Les compléments pour les nouveaux parcours ne couvrent pas encore toutes les particularités normatives. Certains pools n'atteignent pas les cinq fois le nombre de questions tirées recommandées dans l'ED 6127. Aucune opération de travaux sous tension n'est incluse.
- Les réponses sont visibles dans le code source ; épreuves à surveiller. Le lien formateur n'est pas authentifié. Aucune donnée d'apprenti ne doit être commitée au dépôt.
- L'app utilise PDF-lib 1.17.1 sur CDN ; connexion nécessaire au chargement initial, aucun envoi des PDF ni des réponses par le code applicatif. Données de théorie en sessionStorage, dossier formateur en mémoire de l'onglet ; télécharger avant de fermer.
- Source de cadrage : INRS ED 6127 sections 5.4 et 7.2, article R. 4544-10 du Code du travail. Les seuils de sécurité internes peuvent être plus stricts (questions critiques).

Anciennes versions inchangées.
