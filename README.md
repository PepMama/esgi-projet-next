# Météo App

Météo App est une application web réalisée avec Next.js qui permet de
rechercher une ville, de consulter sa météo et ses prévisions, puis de
l'enregistrer dans une liste de favoris.

Le projet utilise les données gratuites de
[Open-Meteo](https://open-meteo.com/).

## Fonctionnalités

- Recherche de villes avec suggestions en temps réel.
- Géocodage des villes avec leur région et leur pays.
- Page météo dynamique pour chaque ville.
- Affichage des conditions actuelles :
  - température ;
  - température ressentie ;
  - humidité ;
  - pression ;
  - vitesse du vent ;
  - indice UV ;
  - état du ciel.
- Horaires du lever et du coucher du soleil.
- Prévisions avec températures minimales et maximales sur 7 jours.
- Ajout et suppression de villes favorites.
- Conservation des favoris dans le stockage local du navigateur.
- États de chargement et pages d'erreur personnalisées.
- Interface responsive pour mobile, tablette et ordinateur.

## Fonctionnalité originale

L'application possède une page de comparaison météo accessible depuis le lien
`Comparer`.

L'utilisateur peut sélectionner deux villes et comparer :

- leur température ;
- leur température ressentie ;
- leur humidité ;
- la vitesse du vent ;
- leurs conditions météorologiques.

L'application indique également la ville la plus chaude et la ville la moins
venteuse. Cette fonctionnalité peut par exemple aider à choisir une destination
pour un week-end.

## Technologies utilisées

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- TypeScript
- App Router
- CSS Modules
- API de géocodage Open-Meteo
- API météo Open-Meteo
- `localStorage` pour les favoris

Aucune bibliothèque d'interface ou de gestion d'état supplémentaire n'est
utilisée.

## Installation

### Prérequis

- Node.js 20.9 ou une version plus récente
- npm

### Lancer le projet

```bash
git clone https://github.com/PepMama/esgi-projet-next.git
cd esgi-projet-next
npm install
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

### Build de production

```bash
npm run build
npm run start
```

### Vérifier le code

```bash
npm run lint
```

## Variables d'environnement

Aucune variable d'environnement n'est nécessaire.

Les API Open-Meteo utilisées par le projet sont gratuites pour cet usage et ne
demandent pas de clé API. Aucun secret ne doit être ajouté dans le dépôt.

## Choix d'architecture

Le projet utilise l'App Router de Next.js.

### Server Components

Les pages sont des Server Components par défaut. La page dynamique
`/ville/[nom]` récupère les données météo côté serveur. La réponse Open-Meteo
est mise en cache pendant 15 minutes afin d'éviter des appels inutiles.

Les Server Components sont utilisés lorsque la page n'a pas besoin d'une
interaction directe avec le navigateur.

### Client Components

Les composants interactifs contiennent la directive `"use client"` :

- `CitySearch` gère la saisie et les suggestions de villes ;
- `FavoriteButton` ajoute ou retire une ville ;
- `FavoritesList` lit les favoris enregistrés dans le navigateur ;
- la page de comparaison gère la sélection et la comparaison des villes ;
- `error.tsx` permet de relancer une requête après une erreur.

Ils sont nécessaires pour utiliser les événements React, les états et le
`localStorage`.

### Route dynamique

La route `app/ville/[nom]` affiche la météo d'une ville. Les coordonnées et le
fuseau horaire sélectionnés pendant la recherche sont transmis dans l'URL.

Cela évite d'effectuer une deuxième recherche de géocodage sur la page météo.

## Organisation du projet

```text
app/
├── comparaison/          Page de comparaison
├── ville/[nom]/          Page météo, erreur et chargement
├── not-found.tsx         Page 404 personnalisée
├── globals.css           Styles communs
└── page.tsx              Page d'accueil
components/
├── CitySearch            Recherche de villes
├── DailyForecast         Prévision d'une journée
├── FavoriteButton        Bouton d'ajout aux favoris
├── FavoritesList         Liste des favoris
└── WeatherMetric         Carte d'une donnée météo
lib/
├── favorites.ts          Lecture et écriture du localStorage
└── weatherCodes.ts       Traduction des codes météo WMO
screenshots/              Captures utilisées dans ce README
```

## Gestion des erreurs

- Une recherche sans résultat affiche un message explicite.
- Les erreurs de géocodage et de comparaison sont affichées dans la page.
- Une erreur de l'API météo ouvre une page avec un bouton pour réessayer.
- Une URL de ville sans coordonnées valides affiche la page 404.
- Un squelette animé est affiché pendant le chargement d'une page météo.

## Captures d'écran

### Accueil, recherche et favoris

![Page d'accueil de Météo App](screenshots/accueil.png)

### Météo détaillée et prévisions

![Météo et prévisions de Paris](screenshots/meteo-paris.png)

### Comparaison de deux villes

![Page de comparaison météo](screenshots/comparaison.png)

## API Open-Meteo

Deux services sont utilisés :

1. L'[API de géocodage](https://open-meteo.com/en/docs/geocoding-api) recherche
   les villes et fournit leurs coordonnées.
2. L'[API de prévisions](https://open-meteo.com/en/docs) fournit les conditions
   actuelles, les informations solaires et les prévisions sur 7 jours.

Les codes météo retournés par l'API suivent les codes d'interprétation de
l'Organisation météorologique mondiale. Ils sont traduits en français dans
`lib/weatherCodes.ts`.

## Auteur

Mini-projet réalisé dans le cadre du cours Next.js.
