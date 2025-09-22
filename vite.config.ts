import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        lib: {
            entry: {
                'chat-widget': resolve(__dirname, 'src/widget.ts')
            },
            name: 'ChatViviendea',
            formats: ['umd', 'es'],
            fileName: (format, entryName) => `${entryName}.${format}.js`
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {},
                assetFileNames: (assetInfo) => {
                    // Mantener los nombres originales de las imágenes
                    if (assetInfo.name && /\.(png|jpe?g|svg|gif)$/i.test(assetInfo.name)) {
                        return assetInfo.name;
                    }
                    // CSS en la raíz también
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'chat-viviendea.css';
                    }
                    return 'assets/[name].[ext]';
                }
            }
        },
        outDir: 'widget-dist',
        sourcemap: true,
        minify: true,
        copyPublicDir: true
    },
    publicDir: 'public',
    define: process.env.VITEST ? {} : {
        'process.env': {},
        'process.env.NODE_ENV': '"production"',
        global: 'globalThis',
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
    },
});
