import FastGlob from 'fast-glob';
import { parse } from 'node:path';

export const clientEntries = ({ clientDir }: { clientDir: string }) =>
  FastGlob([`${clientDir}**/*.{ts,tsx}`], { stats: false }).then(clientFiles =>
    Object.fromEntries(
      clientFiles.map(fileName => {
        const { base, dir, name } = parse(fileName);
        return [`${dir}/${name}`.slice(clientDir.length), `${dir}/${base}`];
      }),
    ),
  );
