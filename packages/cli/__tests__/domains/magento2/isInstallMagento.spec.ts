import { t, TFunction } from 'i18next';
import { stdin, MockSTDIN } from 'mock-stdin';
import { wait } from '../../../src/domains/async';
import { identity } from '../../../src/domains/math';
import isInstallMagento from '../../../src/domains/magento2/prompts/isInstallMagento';

jest.mock('i18next');

const ENTER_KEY = '\x0D';

describe('isInstallMagento | Magento tests', () => {
  let io: MockSTDIN;
  let output = '';

  beforeEach(() => {
    io = stdin();
    output = '';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (t as jest.MockedFunction<TFunction>).mockImplementation(identity);

    jest.spyOn(process.stdout, 'write').mockImplementation((message) => {
      output += message;
      return true;
    });
  });

  it('user can select if they want to install magento', async () => {
    const answer = async () => {
      expect(output).toContain('command.generate_store.magento.install_note');

      expect(output).toContain('command.generate_store.magento.install');

      io.send(ENTER_KEY);

      await wait(100);

      expect(output).toContain('Yes');
    };

    wait(100).then(answer);

    await isInstallMagento('command.generate_store.magento.install');
  });
});
