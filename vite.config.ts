import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // optional, CRA default
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    build: {
        outDir: 'dist',
    },
});
