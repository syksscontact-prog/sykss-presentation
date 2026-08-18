# Quiz SYKSS

Un MVP autonome, entièrement en français et optimisé pour mobile. Ouvrez `index.html` dans un navigateur pour tester le parcours.

## Enregistrement, notification et publication

Le site est prêt à être déployé sur Vercel : il aura alors une vraie adresse Internet et pourra être ouvert partout, sans VPN. L’endpoint `api/submit.js` envoie une notification vers `syksscontact@gmail.com` via Resend après configuration de la variable d’environnement `RESEND_API_KEY`.

Pendant les essais locaux, une réponse est conservée dans le navigateur si l’endpoint n’est pas disponible. Aucune réponse ne sera réellement envoyée par e-mail avant le déploiement et la configuration de Resend. C’est pourquoi l’essai effectué depuis le fichier `index.html` n’a pas envoyé de message.

Le dépôt est relié à Vercel : chaque nouvelle modification est automatiquement déployée.
