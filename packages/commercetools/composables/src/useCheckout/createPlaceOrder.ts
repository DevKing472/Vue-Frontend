/* eslint-disable @typescript-eslint/no-unused-vars */

import { createMyOrderFromCart } from '@vue-storefront/commercetools-api';
import { loading } from './shared';

const createPlaceOrder = ({ cartFields }) => async () => {
  loading.value.order = true;
  const { id, version } = cartFields.cart.value;

  const orderResponse = await createMyOrderFromCart({ id, version });
  const { order } = orderResponse.data;

  loading.value.order = false;
  return order;
};

export default createPlaceOrder;
