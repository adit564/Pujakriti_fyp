import { defineConfig, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: true as unknown as ServerOptions['https'],
  },
  plugins: [react(), mkcert()]

})
