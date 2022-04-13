const path = require('path');
const fse = require('fs-extra');
const findUp = require('find-up');
const { init, parse } = require('es-module-lexer');

module.exports = async function writeRemote(dependencies) {
  Object.keys(dependencies).forEach(async (packageName) => {
    let packageJson;
    let exposeContent = '';
    try {
      packageJson = await findUp('package.json', { cwd: require.resolve(packageName) });
    } catch(error) {
      console.log('fin up error', error);
    }

    const { module, main } = fse.readJSONSync(packageJson);
    const entryPath = path.join(path.dirname(packageJson), module || main || 'index.js');
  
    const source = fse.readFileSync(entryPath, 'utf-8');
    await init;
    const [imports, exports] = parse(source);
    console.log(1, packageName);
    console.log(2, imports.length, exports.length)
    if (!imports.length && !exports.length) {
      exposeContent = `import _ from '${packageName}';\nexport default _;\nexport * from '${packageName}';`;
    }

    if (exports.length) {
      exposeContent = `${exports.includes('default') ? `import _ from '${packageName}';\nexport default _;` : ''}\nexport * from '${packageName}';`;
    }
    console.log(3, exposeContent);
  });
}
