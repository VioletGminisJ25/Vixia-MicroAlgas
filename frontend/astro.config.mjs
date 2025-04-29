// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';
import compress from 'astro-compress';
import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(),],
  },
  server: {
    host: '0.0.0.0',
  },
  devToolbar: {
    enabled: true
  },
  integrations: [react()
    , compress({
      HTML: true,
      CSS: true,
      JavaScript: true,    // para .js / .mjs
      JSON: true,          // para .json
      SVG: true, 
      Path:["/src/pages"], 
    }),
    critters()
  ],

});