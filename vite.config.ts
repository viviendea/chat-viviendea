import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // Configuración para Testing (Vitest)
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
    },
});
