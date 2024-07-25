import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { viteSingleFile } from "vite-plugin-singlefile";
// import { terser } from 'rollup-plugin-terser';

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [reactRefresh(), viteSingleFile()],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    // brotliSize: false,
    outDir: "../dist",
    // rollupOptions: {
    //   // output: {
    //   //   inlineDynamicImports: true,
    //   //   manualChunks: () => "everything.js"
    //   // },
    //   plugins: [ terser() ]
    // },
    // minify: false,
  },
});
