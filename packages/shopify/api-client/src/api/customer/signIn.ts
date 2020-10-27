import {_shopifyCustomClient} from '../../index';
import { signInMutation as mutation} from './buildMutations';

const signIn = async (email, password): Promise<void> => {

  /**
   * Create customer access token.
   *
   * const email = 'hello@aureatelabs.com';
   * const password = '5AernyH5LQDmZEe6';
   */
  const data = {
    input: {
      email: email,
      password: password
    }
  };

  return await _shopifyCustomClient.graphQLClient.send(mutation, data);
};

export default signIn;
