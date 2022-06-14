/**
 * @fileoverview TypeScript types
 */

/**
 * Penpot manifest page
 * 
 * @see https://github.com/penpot/penpot/blob/main/frontend/src/app/worker/export.cljs
 */
export interface ManifestPage
{
  name: string;
}

/**
 * Penpot manifest file
 * 
 * @see https://github.com/penpot/penpot/blob/main/frontend/src/app/worker/export.cljs
 */
export interface ManifestFile
{
  exportType: 'all' | 'merge' | 'detach';
  hasColors: boolean;
  hasComponents: boolean;
  hasMedia: boolean;
  hasTypographies: boolean;
  libraries: string[];
  name: string;
  pages: string[];
  pagesIndex: Record<string, ManifestPage>;
  shared: boolean;
  version: 2;
}

/**
 * Penpot manifest format
 * 
 * @see https://github.com/penpot/penpot/blob/main/frontend/src/app/worker/export.cljs
 */
export interface Manifest
{
  fileId: string;
  files: Record<string, ManifestFile>;
  teamId: string;
}