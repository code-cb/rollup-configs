import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { copy } from '@web/rollup-plugin-copy';
import { resolve } from 'node:path';
import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';
import { clientEntries } from './utils/clientEntries';

const isDev =
  process.env['NODE_ENV'] === 'development' ||
  process.env['ROLLUP_WATCH'] === 'true';
const env = isDev ? 'development' : 'production';

const configs = Promise.all([
  clientEntries({ clientDir: 'src/client/' }),
  import(resolve(process.cwd(), 'package.json')),
]).then(([clientEntries, pkg]) => {
  const clientConfig = defineConfig({
    input: clientEntries,
    output: {
      dir: './dist/static',
      format: 'esm',
      sourcemap: isDev,
    },
    plugins: [
      replace({
        values: { 'process.env.NODE_ENV': JSON.stringify(env) },
        preventAssignment: true,
        sourceMap: isDev,
      }),
      ts({
        tsconfig: {
          fileName: './tsconfig.json',
          hook: resolvedOptions => ({ ...resolvedOptions, sourceMap: isDev }),
        },
      }),
      nodeResolve(),
      commonjs(),
      copy({ exclude: [], patterns: ['**/*'], rootDir: 'public' }),
    ],
  });

  const serverConfig = defineConfig({
    input: './src/server/index.ts',
    external: [/^node:/, ...Object.keys(pkg.dependencies || {})],
    output: {
      dir: './dist',
      format: 'esm',
      sourcemap: isDev,
    },
    plugins: [ts()],
  });

  return [clientConfig, serverConfig];
});

export default configs;
