# Design and Structure Decisions

## General

- Project divided into client/server (currently client only).

- The `src` folder contains everything that will be processed by Vite.

- The `public` folder is limited to `index.html` and raw static files such as favicons or PDFs.

- Installed and used dependencies:

- *React / React DOM* → UI and reactive components.

- *Vite* → modern bundler for development and builds.

- *Sass* → styles with variables, mixins, and modularity.

- *ESLint / Prettier* → best practices and formatting.

- *Jest / Testing Library* → optional testing and development.

- Note: These were installed using `--legacy-peer-deps` due to version conflicts.

## GameLogic

- Clear separation between FaceA and FaceB.

- Each Face contains:

- GameState.js → internal game state.

- Logic.js → game flow and logic functions.

- /classes → instantiable classes (Enemies, Hero, Tower, Buildings, Villagers).

- GameManager.js → global flow and shared data between faces.

- Collider.js → collision definition.

- constants.js → global values.

- *Canvas/CanvasRenderer.js* → sprite rendering using requestAnimationFrame.

- *Canvas/Sprite.js* → base class for all game sprites.

## UI-UX

- Single UI-UX/ folder to avoid complications with small subfolders.

- All React components are imported from here.

- Buttons and HUD are imported from Components.

- MenuStart to control game startup before instantiating logic.

## Hooks

- useGameLoop → main game loop.

- useLocalStorage → data persistence.

- useFaceAState / useFaceBState → pass data to GameManager.

- useStateGeneral is avoided because it's not needed yet.

## Testing and Linting

- ESLint is configured to reinforce best practices, although it doesn't automatically correct errors for learning purposes.

- Jest and Testing Library are installed but not yet used (MVP).

## Comments

- Each module/document has comments in Spanish and English.

- Security: game assets are inside src and are not exposed raw in public.

- Canvas and game logic are documented for future sprite and collider instantiation.