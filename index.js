#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(process.cwd() + '/package.json', 'utf8')
);

if (!config.hasOwnProperty('unscope')) {
  return;
}

if (Array.isArray(config.unscope)) {
  const regex = /^@.*\//;
  config.unscope.forEach(scopedPackage => {
    if (scopedPackage.match(regex) != null) {
      const scopedPath = path.resolve(
        process.cwd(),
        'node_modules',
        scopedPackage
      );
      const unscopedPath = path.resolve(
        process.cwd(),
        'node_modules',
        scopedPackage.replace(regex, '')
      );
      if (!fs.existsSync(unscopedPath)) {
        fs.symlinkSync(scopedPath, unscopedPath);
      }
    } else {
      throw new Error(
        'Invalid scoped package name: ' + scopedPackage,
        ' \n scopedPackage must be @your-name/package-name'
      );
    }
  });
  return;
}

if (typeof config.unscope === 'object') {
  throw new Error('not implemeted yet');
}

throw new Error(
  'invalid unscope attribute. unscope must be object or array',
  config.unscope
);
