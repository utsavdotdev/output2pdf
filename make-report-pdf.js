#!/usr/bin/env node
const { run } = require('./src/cli');

run().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
