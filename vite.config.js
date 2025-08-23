import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['Frontend_Altatech/src/main.jsx'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/api': 'http://localhost:8000',
        },
    },
    build: {
        outDir: 'public/build',
    },
});
