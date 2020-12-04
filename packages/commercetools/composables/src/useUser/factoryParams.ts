import { CustomQuery, UseUserFactoryParams, Context } from '@vue-storefront/core';
import { Customer } from '../types/GraphQL';
import { authenticate } from './authenticate';
import { useCart } from '../useCart';

const loadUser = async (context: Context, customQuery?: CustomQuery) => {
  if (context.$ct.api.isGuest()) {
    return null;
  }

  try {
    const profile = await context.$ct.api.getMe({ customer: true }, customQuery);
    return profile.data.me.customer;
  } catch (err) {
    const errorMessage = err?.graphQLErrors?.[0].message || err.message;

    if (errorMessage.includes('Resource Owner Password Credentials Grant')) {
      return null;
    }

    err.message = errorMessage;
    throw err;
  }
};

const getCurrentUser = async (context: Context, currentUser) => {
  if (!currentUser) {
    return loadUser(context);
  }

  return currentUser;
};

export const params: UseUserFactoryParams<Customer, any, any> = {
  setup(): any {
    return useCart();
  },
  loadUser,
  logOut: async (context: Context) => {
    await context.$ct.api.customerSignOut();
    context.setCart(null);
  },
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    const loadedUser = await getCurrentUser(context, currentUser);
    const { user } = await context.$ct.api.customerUpdateMe(loadedUser, updatedUserData);

    return user;
  },
  register: async (context: Context, { email, password, firstName, lastName }) => {
    const { customer, cart } = await authenticate({email, password, firstName, lastName}, context.$ct.api.customerSignMeUp);
    context.setCart(cart);

    return customer;
  },
  logIn: async (context: Context, { username, password }) => {
    const customerLogin = { email: username, password };
    const { customer, cart } = await authenticate(customerLogin, context.$ct.api.customerSignMeIn);
    context.setCart(cart);

    return customer;
  },
  changePassword: async function changePassword(context: Context, { currentUser, currentPassword, newPassword }) {
    const loadedUser = await getCurrentUser(context, currentUser);
    const userResponse = await context.$ct.api.customerChangeMyPassword(loadedUser.version, currentPassword, newPassword);
    // we do need to re-authenticate user to acquire new token - otherwise all subsequent requests will fail as unauthorized
    await this.logOut(context);
    return await params.logIn(context, { username: userResponse.data.user.email, password: newPassword });
  }
};

