const fs = require('fs');
const path = require('path');

const applicationDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath =>
  path.resolve(applicationDirectory, relativePath);

module.exports = {
  resolvePath,
};
