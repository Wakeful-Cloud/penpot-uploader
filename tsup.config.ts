/**
 * @fileoverview TSUP Config
 */

//Imports
import {defineConfig} from 'tsup';

//Export
export default defineConfig({
  dts: {
    entry: 'src/index.ts'
  },
  entry: [
    'src/cli.ts',
    'src/index.ts'
  ],
  format: ['esm'],
  minify: true
});