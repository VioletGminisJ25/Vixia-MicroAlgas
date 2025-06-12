import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    tailwindcss(),
    react(),

  ],
  server: {
    allowedHosts: ['vixia.algas'],
    host: true,
    port: 4000,
  },
   preview: {
    port: 4000, // También puedes especificarlo en preview para mayor claridad
  },
})
