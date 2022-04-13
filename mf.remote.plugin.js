const path = require('path');

const prebuild = require('./prebuild');

class MFRemotePlugin {
  root = process.cwd();
  pkg = this.resolvePkg();

  constructor() {}

  resolvePkg() {
    const pkg = require(
      path.join(this.root, 'package.json'),
    );
    return pkg;
  }

  apply(complier) {
    // devDependencies remote 是没有意义的
    const { dependencies } = this.pkg;
    prebuild({ dependencies });
  }
}

module.exports = MFRemotePlugin;
