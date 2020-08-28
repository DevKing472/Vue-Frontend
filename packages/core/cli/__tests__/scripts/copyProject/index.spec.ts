import copyProject from '../../../src/scripts/copyProject';
import { copyThemeFiles } from '@vue-storefront/cli/src/utils/helpers';
import updatePackageJson from '@vue-storefront/cli/src/scripts/createProject/updatePackageJson';

const integration = 'commercetools';
const targetPath = 'vsf-new-project';
const absoluteTargetPath = `/home/abc/${targetPath}`;

import path from 'path';

const resolvedTargetPath = 'a';
const projectDirectoryName = 'some-name';

jest.mock('path', () => ({
  join: jest.fn(() => targetPath),
  isAbsolute: jest.fn(() => false),
  resolve: jest.fn(() => resolvedTargetPath)
}));

jest.mock('@vue-storefront/cli/src/scripts/createProject/updatePackageJson', () => jest.fn());

jest.mock('@vue-storefront/cli/src/utils/helpers', () => ({
  getProjectDirectoryName: () => projectDirectoryName,
  copyThemeFiles: jest.fn()
}));

describe('[vsf-next-cli] copyProject', () => {
  it('runs subprograms with proper arguments for relative path', async () => {

    await copyProject(integration, targetPath);

    expect(copyThemeFiles).toHaveBeenCalledWith(resolvedTargetPath, targetPath, resolvedTargetPath);
    expect(updatePackageJson).toHaveBeenCalledWith(targetPath, projectDirectoryName);
  });

  it('runs subprograms with proper arguments for absolute path', async () => {

    (path.join as jest.Mock).mockImplementation(() => absoluteTargetPath);
    (path.isAbsolute as jest.Mock).mockImplementation(() => true);

    await copyProject(integration, absoluteTargetPath);

    expect(copyThemeFiles).toHaveBeenCalledWith(resolvedTargetPath, targetPath, resolvedTargetPath);
    expect(updatePackageJson).toHaveBeenCalledWith(targetPath, projectDirectoryName);
  });
});
