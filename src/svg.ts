/**
 * @fileoverview SVG helper
 */

//Imports
import {optimize, XastElement} from 'svgo';
import {v4 as uuid} from 'uuid';

/**
 * Process the SVG
 * @param raw Raw SVG
 * @returns Processed SVG
 */
const processSVG = (raw: Buffer) =>
{
  //Optimize the SVG
  const optimized = optimize(raw, {
    plugins: [
      'preset-default',
      'sortAttrs',
      {
        name: 'penpot-processor',
        //@ts-expect-error Types are outdated (See https://github.com/svg/svgo/blob/main/plugins-api.md)
        type: 'visitor',
        fn: () => ({
          root: {
            enter: (node: XastElement) =>
            {
              //Get grandchildren
              const grandchildren = [];
              for (const child of node.children)
              {
                if (child.type == 'element')
                {
                  for (const grandchild of child.children)
                  {
                    //Merge properties
                    if (grandchild.type == 'element')
                    {
                      for (const [key, value] of Object.entries(child.attributes))
                      {
                        //Add the attribute if it isn't xmlns-related and the grandchild doesn't already have it
                        if (key != 'xmlns' && !key.startsWith('xmlns:') && grandchild.attributes[key] == null)
                        {
                          grandchild.attributes[key] = value;
                        }
                      }
                    }

                    //Add the grandchild
                    grandchildren.push(grandchild);
                  }
                }
              }

              //Flatten the svg node
              node.children = grandchildren;
            }
          },
          element: {
            enter: (node: XastElement, parent: XastElement) =>
            {
              let nodes = [node];

              //Flatten defs nodes
              if (node.name == 'defs')
              {
                //Remove the node from the parent
                parent.children = parent.children.filter(child => child != node);

                //Add its children back
                parent.children.push(...node.children);

                //Update nodes (Because svgo doesn't recompute the AST)
                nodes = node.children.filter(child => child.type == 'element') as XastElement[];
              }

              //Iterate over nodes
              for (const node of nodes)
              {
                //Get the Penpot type
                let type: string | undefined;
                switch (node.name)
                {
                  case 'clipPath':
                    type = 'frame';
                    break;

                  case 'image':
                    type = 'image';
                    break;

                  case 'rect':
                    type = 'rect';
                    break;

                  case 'circle':
                  case 'ellipse':
                    type = 'circle';
                    break;

                  case 'text':
                    type = 'text';
                    break;

                  case 'g':
                    type = 'group';
                    break;

                  case 'line':
                  case 'polygon':
                  case 'polyline':
                  case 'path':
                    type = 'path';
                    break;
                }

                //Add the penpot metadata
                if (parent != null && type != null)
                {
                  //Remove the node from the parent
                  parent.children = parent.children.filter(child => child != node);

                  //Add a group element with the original node and the "penpot:shape" element
                  parent.children.push({
                    name: 'g',
                    type: 'element',
                    attributes: {
                      id: uuid()
                    },
                    children: [
                      {
                        name: 'penpot:shape',
                        type: 'element',
                        attributes: {
                          'penpot:type': type
                        },
                        children: []
                      },
                      node
                    ]
                  });
                }
              }
            }
          }
        })
      }
    ]
  });

  //Handle errors
  if (optimized.error != null)
  {
    throw new Error(optimized.error);
  }

  return optimized.data;
};

//Export
export default processSVG;