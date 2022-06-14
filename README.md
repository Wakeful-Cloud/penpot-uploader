# Penpot Uploader

[![GitHub Continuous Deployment Status](https://img.shields.io/github/workflow/status/Wakeful-Cloud/penpot-uploader/Continuous%20deployment?label=Deployment&style=for-the-badge)](https://github.com/Wakeful-Cloud/penpot-uploader/actions/workflows/cd.yml)
[![NPM Status](https://img.shields.io/npm/v/@wakeful-cloud/penpot-uploader?style=for-the-badge)](https://npmjs.com/package/@wakeful-cloud/penpot-uploader)

A utility to help bulk-upload SVG files to [Penpot](https://penpot.app) as components. Designed
primarily for importing entire icon libraries, though it may work for other use-cases.

## Documentation

### Limitations
1. ES module support only (No CommonJS support)
2. SVGs are ran through SVGO, which may alter SVGs undesirably

### Installation
1. Install [NodeJS V16+](https://nodejs.org/download/)
2. Install this package:
```bash
# Install as a binary and run (For end users)
npx @wakeful-cloud/penpot-uploader [Arguments]

# Install as a library (For other developers)
npm install @wakeful-cloud/penpot-uploader
```

### Arguments

Name | Default/Required | Example | Description
--- | --- | --- | ---
`i` / `input` | `./**/*.svg` | `--input /path/to/icon/library/**/*.svg` | Input glob
`n` / `name` | `Library` | `--name "My Super Awesome Icons"` | Bundle name (The name shown in Penpot)
`t` / `team-id` | Required | `--team-id c005ab2e-f66d-4635-956e-808d1d612ed9` | Account/team ID (You can get this from Penpot URLs; eg: `https://design.penpot.app/#/dashboard/team/[TEAM ID]/projects`)
`o` / `output` | `./library.penpot` | `--output /path/to/output/my-super-awesome-icons.penpot` | Output path (You'll probably want to use the `.penpot` file extension)

*Note: this utility does not use positional arguments.*

### How it works
This utility works by running all inputted SVGs through [SVGO](https://github.com/svg/svgo) to
normalize and add special metadata required by Penpot to them. Then, it combines the SVGs and writes
them to a ZIP file along with a manifest file and a blank page (Also required by Penpot).