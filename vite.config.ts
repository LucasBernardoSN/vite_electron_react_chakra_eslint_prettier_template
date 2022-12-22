import electron, { Configuration } from 'vite-plugin-electron';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { rmSync } from 'fs';

rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true }); // v14.14.0
const electronConfig: Configuration = {
  main: {
    entry: 'electron/main/index.ts',
    vite: {
      build: {
        outDir: 'dist/electron/main',
      },
    },
  },
  renderer: {},
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [`process.env.${key}`]: `"${val}"`,
      };
    },
    {}
  );

  return {
    plugins: [react(), electron(electronConfig)],
    server: {
      port: 3000,
    },
    build: {
      minify: true,
      outDir: 'dist/web',
    },
    define: envWithProcessPrefix,
  };
});

// ? =================== ⬆ Electron ⬆ ===================

// // =================== ⬇ Web ⬇ ===================

// import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
// });
