#!/usr/bin/env node

/**
 * @fileoverview CLI entrypoint
 */

//Imports
import chalk from 'chalk';
import generate from './index.js';
import {globby} from 'globby';
import {parse, resolve} from 'path';
import {program} from 'commander';
import {readFile, writeFile} from 'fs/promises';

/**
 * Command line options
 */
interface Options
{
  /**
   * Input glob
   */
  input: string;

  /**
   * Bundle name
   */
  name: string;

  /**
   * Account/team ID
   */
  teamId: string;

  /**
   * Output path
   */
  output: string;
}

//Create the root command
const command = program
  .name('penpot-uploader')
  .description('A utility to help bulk-upload SVG files to Penpot as components')
  .option('-i, --input <glob>', 'input glob', './**/*.svg')
  .option('-n, --name <name>', 'bundle name', 'Library')
  .requiredOption('-t, --team-id <id>', 'account/team ID')
  .option('-o, --output <path>', 'output path', './library.penpot')
  .action(async (options: Options) =>
  {
    //Resolve paths
    const input = resolve(options.input);
    const output = resolve(options.output);

    //Get input files
    const files = await globby(input.replace(/\\/g, '/'), {
      absolute: true,
      onlyFiles: true
    });

    //Get SVGs
    const svgs = {} as Record<string, Buffer>;
    for (const file of files)
    {
      //Log
      console.log(chalk.blueBright(`[Info] Adding ${file} to the bundle.`));

      //Get the file name (Without any extensions)
      const {name} = parse(file);

      //Read the file
      const raw = await readFile(file);

      //Add the svg
      svgs[name] = raw;
    }

    //Generate the bundle
    const bundle = await generate(options.name, options.teamId, svgs);

    //Save the bundle
    await writeFile(output, bundle);

    //Log
    console.log(chalk.greenBright(`[Info] All done! (Wrote bundle to ${output})`));
  });

//Process arguments and options
command.parse(process.argv);