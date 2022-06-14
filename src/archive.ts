/**
 * @fileoverview Penpot archive helper
 */

//Imports
import JSZip from 'jszip';
import {Manifest} from './types.js';
import {v4 as uuid} from 'uuid';

/**
 * Generate the Penpot bundle archive
 * @param name Bundle name
 * @param teamID Account/team ID
 * @param components Component SVGs (Indexed by their final component names)
 * @returns ZIP file
 */
const generateArchive = async (name: string, teamId: string, components: Record<string, string>) =>
{
  //Generate some UUIDs
  const fileId = uuid();
  const pageId = uuid();

  //Generate the components file
  const rawComponents = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \
xmlns:penpot="https://penpot.app/xmlns"><defs>${Object.entries(components)
      .map(([key, value]) => `<symbol id="${uuid()}"><title>${key}</title><g id="${uuid()}"><penpot:shape penpot:type="group" penpot:name="${key}" /><g id="${uuid()}">${value}</g></g></symbol>`).join('')
}</defs></svg>`;

  //Generate the page file
  const rawPage = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \
xmlns:penpot="https://penpot.app/xmlns"></svg>';

  //Generate the manifest
  const manifest = {
    fileId,
    files: {
      [fileId]: {
        exportType: 'all',
        hasColors: false,
        hasComponents: true,
        hasMedia: false,
        hasTypographies: false,
        libraries: [],
        name,
        pages: [
          pageId
        ],
        pagesIndex: {
          [pageId]: {
            name: 'Temporary' //Penpot breaks if there isn't at least one page
          }
        },
        shared: false,
        version: 2
      }
    },
    teamId
  } as Manifest;
  const rawManifest = JSON.stringify(manifest);

  //Create a new ZIP file
  const zip = new JSZip();

  //Add the manifest
  zip.file('manifest.json', rawManifest);

  //Add the SVGs
  const folder = zip.folder(fileId);
  folder!.file('components.svg', rawComponents);
  folder!.file(`${pageId}.svg`, rawPage);

  //Generate the ZIP file
  const archive = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  });

  return archive;
};

//Export
export default generateArchive;