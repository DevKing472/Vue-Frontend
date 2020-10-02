#!/usr/bin/env node
import log from './utils/log';
import path from 'path';

export const cli = async (args) => {
  const [command] = args.slice(2);
  if (!command) {
    log.error('Provide command');
    return;
  }

  try {
    const commandFn = require(path.join(__dirname, `./commands/${command}.ts`));
    return commandFn.default(args.slice(3));
  } catch (err) {
    try {
      const commandFn = require(path.join(__dirname, `./commands/${command}.js`));
      return commandFn.default(args.slice(3));
    } catch (err) {
      log.error('Bad command');
    }
  }
};

cli(process.argv);
