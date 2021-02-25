const TypeDoc = require('typedoc');

const app = new TypeDoc.Application();

// If you want TypeDoc to load tsconfig.json / typedoc.json files
app.options.addReader(new TypeDoc.TSConfigReader());
app.options.addReader(new TypeDoc.TypeDocReader());

app.bootstrap({
  entryPoints: ['../../commercetools/api-client/src/api'],
  tsconfig: '../../commercetools/api-client/tsconfig.json',
  name: 'API Client Reference',
  includeVersion: true,
  readme: 'none',
  hideBreadcrumbs: true,
  hideInPageTOC: true
});

const project = app.convert();

if (project) {
  const outputDir = 'commercetools/api-client-reference';
  app.generateDocs(project, outputDir);
}
