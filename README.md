# PersistenceClicker - Client
## Time cannot be beaten... Only delayed...


PersistenceClicker is a dual-simulation web game built around a custom game engine architecture, 
where two interconnected systems (real-time survival and asynchronous city-building) 
evolve over a shared persistent world.

The project focuses on architecture: custom game engine, scene management, 
offline progression, and cross-system state synchronization.


## Core Concepts


- **Dual simulation system**: FaceA (real-time survival) and FaceB (asynchronous city builder)
- **Shared world state**: both systems operate on the same persistent map
- **Cross-progression**: resources generated in one system affect the other
- **Offline progression**: time continues to evolve even when the game is not running


## Key features


- Custom game loop using requestAnimationFrame
- Scene-based architecture
- Modular engine structure
- Decoupled systems (Time, Interaction, Rendering)
- Persistent state management via localStorage


## Architecture


React UI
↓
SceneManager
↓
Engine (Renderer + Systems + Camera)
↓
Game Logic (FaceA / FaceB)
↓
World State
↓
Persistence (localStorage)


## Persistence system


Game state is serialized into a unified save object stored in localStorage, including:

- World state (map, structures, rules)
- Face-specific states (FaceA / FaceB)
- Meta progression and shared resources
- Timestamps for offline time simulation


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


## What I learned 


- Designing modular game architectures
- Managing complex shared state across systems
- Handling time-based simulations and offline progression
- Separating UI from core logic


## Future Improvements


- ECS-style system architecture
- WebGL renderer
- Cloud-based persistence


## Summary


This project explores how complex game systems can be modeled and synchronized 
in a web environment, focusing on architecture, state management, and time-based simulation.