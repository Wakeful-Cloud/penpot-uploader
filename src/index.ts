/**
 * @fileoverview Penpot uploader
 */

//Imports
import generateArchive from './archive.js';
import processSVG from './svg.js';

/**
 * Generate the Penpot bundle
 * @param name Bundle name
 * @param teamId Account/team ID
 * @param svgs SVGs to bundle (Indexed by their final component names)
 * @returns ZIP file
 */
const bundle = async (name: string, teamId: string, svgs: Record<string, Buffer>) =>
{
  //Get components
  const components = {} as Record<string, string>;
  for (const [name, raw] of Object.entries(svgs))
  {
    //Process the SVG
    const component = processSVG(raw);

    //Add the component
    components[name] = component;
  }

  //Generate the bundle
  const bundle = await generateArchive(name, teamId, components);

  return bundle;
};

//Export
export default bundle;