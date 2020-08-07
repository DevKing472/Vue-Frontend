import path from 'path';
import log from '@vue-storefront/cli/src/utils/log';
import copyIntegrationTheme from '@vue-storefront/cli/src/scripts/createProject/copyIntegrationTheme';
import copyAgnosticTheme from '@vue-storefront/cli/src/scripts/createProject/copyAgnosticTheme';
import processMagicComments from '@vue-storefront/cli/src/scripts/createProject/processMagicComments';
import updatePackageName from '@vue-storefront/cli/src/scripts/createProject/updatePackageName';

const getProjectDirectoryName = (targetPath: string): string => targetPath.split('/').pop();

async function createProject(integration: string, targetPath: string): Promise<void> {

  log.info(`Coppying ${integration}-theme to ${targetPath}`);
  await copyIntegrationTheme(integration, targetPath, ['_theme', '.nuxt', 'node_modules']);

  log.info(`Coppying agnostic theme to ${targetPath}`);
  await copyAgnosticTheme(integration, targetPath);

  log.info('Updating Nuxt config');
  const absoluteTargetPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.join(__dirname, targetPath);
  const nuxtConfigPath = path.join(absoluteTargetPath, 'nuxt.config.js');
  await processMagicComments(nuxtConfigPath);

  const packageJsonPath = path.join(absoluteTargetPath, 'package.json');
  await updatePackageName(packageJsonPath, getProjectDirectoryName(targetPath));
}

export default createProject;
