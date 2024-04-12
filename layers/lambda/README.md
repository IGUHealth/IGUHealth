# Lambda Layer

Generate AWS Lambda layer by building node_modules and setting to latest version of packages from IGUHealth

## Why not Yarn

Because yarn utilizes PnP across workspace moving outside of workspace and installing via NPM .
Note: could have it where yarn PnP gets used on lambda but requires discerning what deps are specific to this package and loading .pnp.js on lambda startup.

## Packaging

See https://docs.aws.amazon.com/lambda/latest/dg/packaging-layers.html
Create Zip with structure nodejs/node_modules
This is done in CI under workflows/release_layers.yml post workflows/release_npm.yml.
