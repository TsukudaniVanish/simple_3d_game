export * as ReactDOM from "https://jspm.dev/react-dom@17.0.0"

import * as React from "https://jspm.dev/react@17.0.0"

const {default: any, ...rest} = React
const react = React.default

export {react as React}
export {rest as react}

// three.js
import * as threejs4Deno from "https://deno.land/x/threejs_4_deno@v121/src/Three.js";
export {threejs4Deno as Three}

import gameconfigJson from "./gameconfig.json" assert { type: 'json'}
const dodgeBoxesConfig = gameconfigJson.DodgeBoxes
const explorerConfig = gameconfigJson.Explorer
export {dodgeBoxesConfig, explorerConfig}