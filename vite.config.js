import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    root: "public",
    plugins: [react()],
    build: {
        outDir: "../dist",
        emptyOutDir: true  //para que borre la build anterior
    }
});
