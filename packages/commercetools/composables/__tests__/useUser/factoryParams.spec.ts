import { params } from '../../src/useUser/factoryParams';
import { authenticate } from '../../src/useUser/authenticate';
import useCart from '../../src/useCart';

jest.mock('../../src/useCart', () => jest.fn(() => {}));

jest.mock('../../src/useUser/authenticate', () => ({
  authenticate: jest.fn()
}));

const customer: any = {
  email: 'test@test.pl',
  password: '123456',
  firstName: 'Don',
  lastName: 'Jon',
  version: '1'
};

const refreshCartMock = jest.fn(() => {});

const context = {
  $ct: {
    api: {
      getMe: jest.fn(),
      customerSignOut: jest.fn(),
      customerChangeMyPassword: jest.fn(),
      createCart: jest.fn(),
      customerUpdateMe: jest.fn(),
      getSettings: jest.fn(() => ({ currentToken: 1 })),
      isGuest: jest.fn()
    }
  },
  setCart: jest.fn()
} as any;

describe('[commercetools-composables] factoryParams', () => {
  it('load return customer data', async () => {

    (context.$ct.api.getMe as jest.Mock).mockReturnValueOnce({ data: { me: { customer } }});
    expect(await params.load(context as any)).toEqual(customer);

    (context.$ct.api.getMe as jest.Mock).mockReturnValueOnce({ data: { me: { customer: null } }});
    expect(await params.load(context)).toEqual(null);
  });

  it('does not loading the user without user session', async () => {
    (context.$ct.api.isGuest as any).mockReturnValue(true);
    expect(await params.load(context as any)).toEqual(null);
  });

  it('logOut method calls API log out method', async () => {
    (context.$ct.api.createCart as jest.Mock).mockReturnValueOnce({ data: { cart: {} }});
    (useCart as jest.Mock).mockReturnValueOnce({refreshCart: refreshCartMock});
    await params.logOut(context as any);
    expect(context.$ct.api.customerSignOut).toHaveBeenCalled();
  });

  it('updateUser return updated user', async () => {
    const user = {currentUser: 'Jon', updatedUserData: 'Bob'} as any;
    (context.$ct.api.customerUpdateMe as jest.Mock).mockReturnValueOnce({ user });
    expect(await params.updateUser(context as any, user)).toEqual(user);
  });

  it('updates the user and loads when it is not available', async () => {
    const user = {currentUser: null, updatedUserData: 'Bob'} as any;
    (context.$ct.api.getMe as jest.Mock).mockReturnValueOnce({ data: { me: user } });

    (context.$ct.api.customerUpdateMe as jest.Mock).mockReturnValueOnce({ user });
    expect(await params.updateUser(context as any, user)).toEqual(user);
  });

  it('register method return a new customer', async () => {
    (authenticate as jest.Mock).mockReturnValueOnce({ customer });
    expect(await params.register(context as any, customer)).toEqual(customer);
  });

  it('logIn method return a logged in customer', async () => {
    (useCart as jest.Mock).mockReturnValueOnce({refreshCart: refreshCartMock});
    (authenticate as jest.Mock).mockReturnValueOnce({ customer });
    expect(await params.logIn(context as any, customer)).toEqual(customer);
  });

  describe('changePassword', () => {
    it('register method return a new customer', async () => {
      (authenticate as jest.Mock).mockReturnValueOnce({ customer });
      expect(await params.register(context as any, customer)).toEqual(customer);
    });

    it('succeed returning logged user', async () => {
      const cart = {};
      const changePasswordParams: any = { currentUser: customer, currentPassword: '', newPassword: '' };

      (context.$ct.api.createCart as jest.Mock).mockReturnValueOnce({ data: { cart }});
      (useCart as jest.Mock).mockReturnValueOnce({ refreshCart: refreshCartMock });
      (context.$ct.api.customerChangeMyPassword as jest.Mock).mockReturnValueOnce({ data: { user: customer }});
      (authenticate as jest.Mock).mockReturnValueOnce({ customer, cart });

      expect(await params.changePassword(context as any, changePasswordParams)).toEqual(customer);
      expect(context.$ct.api.customerSignOut).toHaveBeenCalled();
    });
  });
});
