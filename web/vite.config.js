import react from '@vitejs/plugin-react';
import { defineConfig, transformWithEsbuild, loadEnv } from 'vite';
// import SemiPlugin from "vite-plugin-semi-theme";
import svgr from 'vite-plugin-svgr'; // 新增

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(process.env.NODE_ENV ?? mode, root);
  return {
    plugins: [
      {
        name: 'treat-js-files-as-jsx',
        async transform(code, id) {
          if (!/src\/.*\.js$/.test(id)) {
            return null;
          }

          // Use the exposed transform from vite, instead of directly
          // transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic'
          });
        }
      },
      react(),
      // SemiPlugin({
      //   theme: '@semi-bot/semi-theme-universedesign',
      //   options: {},
      // }),
      svgr({ include: 'src/assets/svg/**/*.svg?react' })
    ],
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core': ['react', 'react-dom', 'react-router-dom'],
            'semi-ui': ['@douyinfe/semi-icons', '@douyinfe/semi-ui'],
            semantic: ['semantic-ui-offline', 'semantic-ui-react'],
            visactor: ['@visactor/react-vchart', '@visactor/vchart'],
            tools: ['axios', 'history', 'marked'],
            'react-components': ['react-dropzone', 'react-fireworks', 'react-telegram-login', 'react-toastify', 'react-turnstile']
          }
        }
      }
    },
    server: {
      // https: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_SERVER || 'http://localhost:3000',
          changeOrigin: true
        },
        '/pg': {
          target: env.VITE_APP_SERVER || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  };
});
