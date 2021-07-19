import { changeCustomerEmailAction, setCustomerFirstNameAction, setCustomerLastNameAction } from '../../helpers/customer';
import CustomerUpdateMeMutation from './defaultMutation';

const customerUpdateMe = async ({ client, config }, currentUser, updatedUserData) => {
  const updateResponse = await client.mutate({
    mutation: CustomerUpdateMeMutation,
    variables: {
      version: currentUser.version,
      actions: [
        changeCustomerEmailAction(updatedUserData.email),
        setCustomerFirstNameAction(updatedUserData.firstName),
        setCustomerLastNameAction(updatedUserData.lastName)
      ],
      storeKey: config.store
    },
    fetchPolicy: 'no-cache'
  });

  return updateResponse.data;
};

export default customerUpdateMe;
