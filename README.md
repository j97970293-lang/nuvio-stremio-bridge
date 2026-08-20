# Nuvio Stremio Bridge

Ce dépôt fournit un **addon Stremio minimal** destiné à recevoir des adaptateurs locaux révisés. Il expose un manifeste, une ressource `stream` et un registre de providers sans navigateur intégré ni exécution de code distant.

L’addon utilise les identifiants IMDb de Cinemeta pour les films et séries. Il ne fournit ni catalogue ni métadonnées ; Stremio continue d’utiliser Cinemeta pour ces éléments.

## Démarrage local

Exécuter `npm test`, puis `npm start`. Installer ensuite `http://localhost:7000/manifest.json` depuis Stremio Desktop. Pour une installation sur un autre appareil, exposer l’addon via une URL HTTPS que vous contrôlez.

## Ajouter un adaptateur

Créer un module local, le réviser, puis l’enregistrer dans `src/providers/index.mjs`. Il doit recevoir `{ type, imdbId, season, episode }` et renvoyer des candidats avec une URL HTTPS média directe, facultativement accompagnée de qualité et langue.

> Le bridge ne charge jamais un script de provider directement depuis GitHub ou une URL. Cela évite l’exécution de code non vérifié et rend chaque adaptation testable.

Les sorties sont volontairement filtrées : liens HTTP, pages HTML, embeds, cookies ou en-têtes d’autorisation ne sont pas publiés. Un serveur qui refuse l’accès doit rester refusé ; le bridge ne cherche pas à contourner DRM, authentification, abonnement ou restriction serveur.

## État Nuvio

Les dépôts Nuvio constituent une source de structures d’adaptateurs, mais ne sont pas une API Stremio prête à importer. Chaque provider doit être porté localement, vérifié et activé explicitement. Aucun provider tiers n’est activé dans cette version initiale.
