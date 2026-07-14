# Portfolio modulaire

Ce portfolio a été refactoré en une architecture HTML/CSS/JS modulaire, sans modifier l’esprit visuel original.

## Structure

- index.html : point d’entrée HTML de la page
- css/ : styles séparés par responsabilité
- js/ : modules ES6 pour la logique métier et l’interactivité
- data/ : fichiers JSON utilisés pour alimenter les sections dynamiques
- assets/ : images, logos et supports visuels

## Fonctionnement

- Les projets et compétences sont chargés depuis des fichiers JSON.
- Les sections interactives (dashboard, galerie, contact, GitHub) sont initialisées via des modules ES6.
- Les styles et animations sont séparés pour faciliter la maintenance.

## Personnalisation

1. Modifiez les fichiers JSON dans data/ pour mettre à jour les contenus.
2. Ajoutez vos images dans assets/.
3. Ajustez les styles dans css/ si nécessaire.

## Déploiement

Le site peut être déployé sur GitHub Pages, Netlify ou tout hébergement statique.
