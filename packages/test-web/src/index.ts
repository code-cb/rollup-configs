import { copy } from '@web/rollup-plugin-copy';
import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';
import { clientEntries } from './utils/clientEntries';

const configs = clientEntries({ clientDir: 'src/' }).then(entries => [
  defineConfig({
    input: entries,
    output: { dir: 'dist', format: 'esm' },
    plugins: [
      ts(),
      copy({ exclude: [], patterns: ['**/*'], rootDir: 'public' }),
    ],
  }),
]);

export default configs;
