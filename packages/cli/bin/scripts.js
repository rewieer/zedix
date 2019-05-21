#!/usr/bin/env node
const init = require('../scripts/init');

const args = process.argv.slice(2);
const command = args.shift();
const configMap = {};

for (let i = 0; i < args.length; i += 2) {
  configMap[args[i].substr(2)] = args[i + 1];
}

switch (command) {
  case "init":
    init(configMap);
    break;
  default:
    console.warn("Command not recognized.");
}
