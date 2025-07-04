const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};

//comando para crear el archivo
//npx ts-jest config:init


// nmp start para reacr serve 

//comaddo para correr npm test