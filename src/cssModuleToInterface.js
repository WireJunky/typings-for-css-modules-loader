import path from 'path';

const filenameToInterfaceName = (filename) => {
  return path.basename(filename)
    .replace(/^(\w)/, (_, c) => c.toUpperCase())
    .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleKeys, indent = '  ') => {
  return cssModuleKeys
    .map((key) => {
      let camelCased = key.replace(/-([a-zA-Z0-9])/g, function (g) { return g[1].toUpperCase(); });
      return `${indent} \"${camelCased}\" = \"${key}\",`;
    })
    .join('\n');
};

const cssModuleToNamedExports = (cssModuleKeys) => {
  return cssModuleKeys
    .map((key) => `export const ${key}: string;`)
    .join('\n');
};

const allWordsRegexp = /^\w+$/i;
export const filterNonWordClasses = (cssModuleKeys) => {
  const filteredClassNames = cssModuleKeys.filter(classname => allWordsRegexp.test(classname));
  if (filteredClassNames.length === cssModuleKeys.length) {
    return [filteredClassNames, [],];
  }
  const nonWordClassNames = cssModuleKeys.filter(classname => !allWordsRegexp.test(classname));
  return [filteredClassNames, nonWordClassNames,];
};

export const filenameToTypingsFilename = (filename) => {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.ts`);
};

export const generateNamedExports = (cssModuleKeys) => {
  const namedExports = cssModuleToNamedExports(cssModuleKeys);
  return (`${namedExports}
`);
};

export const generateGenericExportInterface = (cssModuleKeys, filename, indent) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, indent);
  return (
`const enum ${interfaceName} {
${interfaceProperties}
}
export default ${interfaceName};
`);
};
