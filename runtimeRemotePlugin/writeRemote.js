const path = require('path');
const fse = require('fs-extra');
const findUp = require('find-up');
const { init, parse } = require('es-module-lexer');

const rootDir = __dirname;
const exposesDir = path.join(rootDir, 'exposesDir');

module.exports = async function writeRemote(dependencies) {
  fse.ensureDirSync(exposesDir);

  return Promise.all(
    Object.keys(dependencies).map(async (packageName) => {
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
      if (!imports.length && !exports.length) {
        exposeContent = `import _ from '${packageName}';\nexport default _;\nexport * from '${packageName}';`;
      }
  
      if (exports.length) {
        exposeContent = `${exports.includes('default') ? `import _ from '${packageName}';\nexport default _;` : ''}\nexport * from '${packageName}';`;
      }

      const exposePath = path.join(exposesDir, packageName, 'index.js');
      fse.ensureFileSync(exposePath);
      fse.writeFileSync(exposePath, exposeContent, { encoding: 'utf-8' });

      return { packageName, exposePath };
    }),
  );
}
