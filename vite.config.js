import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: '/PersistenceClicker/',
    build: {
        outDir: "/Users/unjar/Desktop/Proyectos/PersistenceClicker/Client/dist",
        emptyOutDir: true  //para que borre la build anterior
    }
});
