# PersistanceClicker - Client

Dual interconnected clicker game
This browser app contains the React/Vite client of the project

## Main Structure

- `src/assets` -> Sprites, sounds, fonts
- `src/canvas` -> Render logic and sprittes classes
- `src/gameLogic` -> GameManager, FaceA and FaceB, constants and colliders
- `src/hooks` -> Custom hooks (`useGameLoop`, `useLocalStorage`, `useStateA`, `useStateB`)
- `src/UI-UX` -> Interface components
- `src/utils` -> General functions of JS
- `src/styles` -> Global Sass and components

## Available Scripts 

```bash
npm run dev     # Start the Vite development server
npm run build   # Generates the production build in 'dist'
npm run lint    # Run ESlint
npm run format  # Format code with Prettier
```

## Main dependencies

React / React DOM
Vite
Sass
ESlint / Prettier
Jest / Testing Library

## How to run

npm install
npm run dev