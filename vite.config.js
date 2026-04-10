import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: '/PersistenceClicker/',
    build: {
        outDir: "../dist",
        emptyOutDir: true  //para que borre la build anterior
    }
});
