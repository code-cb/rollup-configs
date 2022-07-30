import { copy } from '@web/rollup-plugin-copy';
import { readdirSync } from 'node:fs';
import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';

const config = defineConfig({
  input: readdirSync('./src').map(file => `./src/${file}`),
  output: { dir: 'dist', format: 'esm' },
  plugins: [ts(), copy({ exclude: [], patterns: ['**/*'], rootDir: 'public' })],
});

export default config;
