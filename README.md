# Dashboard Trains – Nivelles

Dashboard interne affiché sur un écran au bureau de Nivelles.  
Il montre en temps réel les prochains trains, leurs retards moyens, le taux d’annulation et l’heure actuelle, à partir de l’API publique iRail.

## Objectif

Moderniser l’ancien tableau de bord avec React et TypeScript.  
Créer une base simple, claire et extensible pour ajouter d’autres widgets internes (builds CI, tickets, météo…).

## Stack technique

- React 18 / Vite
- TypeScript
- Zustand (gestion d’état)
- Jest (tests unitaires)
- Lodash
- API iRail (données SNCB)

## Fonctionnement

Le dashboard :

- Récupère les trains de Nivelles via l’API iRail
- Calcule les retards moyens et les annulations récentes
- Rafraîchit les données toutes les 30 secondes
- Affiche plusieurs widgets :
  - **TrainWidget** : départs / arrivées
  - **KPIWidget** : statistiques
  - **Clock** : heure et date en direct

## Lancer le projet

### Installation

npm install

### Lancement

npm run dev

### Test

npm run test

## A améliorer

Optimisation des appels
Ajout d'autres modules
