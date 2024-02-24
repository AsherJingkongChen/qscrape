/// <reference types="vitest" />

import { chmod } from 'fs/promises';
import { PluginOption, defineConfig } from 'vite';
import ViteDtsPlugin from 'vite-plugin-dts';

export default defineConfig((env) => ({
  build: {
    lib: {
      entry: ['src/bin.ts', 'src/lib.ts'],
      name: 'QScrape',
    },
    minify: env.mode === 'production',
    outDir: 'dist',
    ssr: true,
  },
  esbuild: {
    drop: env.mode === 'production' ? ['console', 'debugger'] : undefined,
    platform: 'node',
  },
  plugins: [
    BundleFinishBannerPlugin(env),
    ChangeExecutablePermissionPlugin(),
    DtsPlugin(),
    RemoveMultiLineCommentsPlugin(env),
  ],
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
      provider: 'istanbul',
      reporter: ['text', 'text-summary'],
      thresholds: {
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    fileParallelism: false,
    maxConcurrency: 1,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    include: ['tests/**/*.test.ts'],
  },
}));

function BundleFinishBannerPlugin(context: { mode: string }): PluginOption {
  return {
    name: '\x1b[36mbundle-finish-banner\x1b[0m',
    apply: 'build',
    enforce: 'post',
    closeBundle: {
      order: 'post',
      handler() {
        this.info({
          message: '\x1b[32m' + `Built in ${context.mode} mode` + '\x1b[0m',
        });
      },
    },
  };
}

function ChangeExecutablePermissionPlugin(): PluginOption {
  return {
    name: '\x1b[36mchange-executable-permission\x1b[0m',
    apply: 'build',
    enforce: 'post',
    closeBundle: {
      order: 'pre',
      sequential: true,
      async handler() {
        this.info({
          message:
            '\x1b[32m' +
            'Changing permission of output executables ...' +
            '\x1b[0m',
        });
        await Promise.all([
          chmod('dist/bin.js', '755'),
          chmod('dist/bin.cjs', '755'),
        ]);
        this.info({
          message: '\x1b[32m' + 'Done' + '\x1b[0m',
        });
      },
    },
  };
}

function DtsPlugin(): PluginOption {
  return ViteDtsPlugin({
    entryRoot: '.',
    include: 'src',
    insertTypesEntry: true,
    rollupTypes: true,
  });
}

function RemoveMultiLineCommentsPlugin(context: {
  mode: string;
}): PluginOption {
  return context.mode === 'production'
    ? {
        name: '\x1b[36mremove-multi-line-comments\x1b[0m',
        apply: 'build',
        enforce: 'post',
        generateBundle: {
          order: 'post',
          async handler(options, bundles) {
            this.info({
              message:
                '\x1b[32m' + 'Removing multi-line comments ...' + '\x1b[0m',
            });
            if (options.format !== 'es') {
              return;
            }
            for (const bundle of Object.values(bundles)) {
              if (bundle.type !== 'chunk') {
                continue;
              }
              bundle.code = bundle.code.replace(/\s*\/\*\*[^\/]*\*\//g, '');
            }
            this.info({
              message: '\x1b[32m' + 'Done' + '\x1b[0m',
            });
          },
        },
      }
    : undefined;
}
