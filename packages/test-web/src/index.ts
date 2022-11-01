import { copy } from '@web/rollup-plugin-copy';
import { sync } from 'fast-glob';
import { parse } from 'node:path';
import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';

const SRC_DIR = './src/';

const entries = Object.fromEntries(
  sync([`${SRC_DIR}**/*.{ts,tsx}`], { stats: false }).map(fileName => {
    const { dir, name, base } = parse(fileName);
    return [`${dir}/${name}`.slice(SRC_DIR.length), `${dir}/${base}`];
  }),
);

export const config = defineConfig({
  input: entries,
  output: { dir: 'dist', format: 'esm' },
  plugins: [ts(), copy({ exclude: [], patterns: ['**/*'], rootDir: 'public' })],
});

export default [config];
