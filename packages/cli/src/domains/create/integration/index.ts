import { spinner } from '@clack/prompts';
import { cloneGitRepository, log } from '../../../utils';
import { handleFrameworkClone, removeUnwantedFiles } from './helpers';
import picocolors from 'picocolors';

interface CreateIntegrationBoilerplateOptions {
  projectDir: string;
  framework: string;
}

export const createIntegrationBoilerplate = async ({
  projectDir,
  framework,
}: CreateIntegrationBoilerplateOptions): Promise<string> => {
  const sp = spinner();

  log(`Creating integration boilerplate in ${picocolors.green(projectDir)} directory${framework ? `, using ${picocolors.green(framework)} framework...` : ''}`);

  sp.start('Cloning integration boilerplate...');
  await cloneGitRepository({
    projectDir: projectDir,
    ref: 'feat/dx-audit',
    gitRepositoryURL: 'https://github.com/vuestorefront/integration-boilerplate.git',
  });
  sp.stop('Integration boilerplate has been cloned successfully!');

  await handleFrameworkClone(projectDir, framework);

  await removeUnwantedFiles(projectDir);

  return projectDir;
}
