/* eslint-disable camelcase, @typescript-eslint/camelcase */

import { createContext, createPayment, getCustomerCards, removeSavedCard } from './payment';
import { Ref, ref, computed } from '@vue/composition-api';
import { getPublicKey, getFramesStyles, getTransactionTokenKey, Configuration, getFramesLocalization } from './configuration';
import { CkoPaymentType, buildPaymentPayloadStrategies, PaymentPropeties, PaymentInstrument } from './helpers';

declare const Frames: any;

const isCardValid = ref(false);
const error = ref(null);
const storedPaymentInstruments = ref<PaymentInstrument[]>([]);

const getTransactionToken = () => localStorage.getItem(getTransactionTokenKey());
const setTransactionToken = (token) => localStorage.setItem(getTransactionTokenKey(), token);
const removeTransactionToken = () => localStorage.removeItem(getTransactionTokenKey());

const getCurrentPaymentMethodPayload = (paymentMethod: CkoPaymentType, payload: PaymentPropeties) => buildPaymentPayloadStrategies[paymentMethod](payload);

const useCkoCard = (selectedPaymentMethod: Ref<CkoPaymentType>) => {
  const submitDisabled = computed(() => selectedPaymentMethod.value === CkoPaymentType.CREDIT_CARD && !isCardValid.value);
  const makePayment = async ({ cartId, email, contextDataId = null, savePaymentInstrument = false }) => {
    try {

      const token = getTransactionToken();

      if (!token) {
        throw new Error('There is no payment token');
      }

      let context;
      if (!contextDataId) {
        context = await createContext({ reference: cartId, email });
      }

      const payment = await createPayment(
        getCurrentPaymentMethodPayload(selectedPaymentMethod.value, {
          token,
          context_id: contextDataId || context.data.id,
          save_payment_instrument: selectedPaymentMethod.value === CkoPaymentType.CREDIT_CARD && savePaymentInstrument,
          secure3d: true,
          success_url: `${window.location.origin}/cko/payment-success`,
          failure_url: `${window.location.origin}/cko/payment-error`
        })
      );

      removeTransactionToken();
      if (![200, 202].includes(payment.status)) {
        throw new Error(payment.data.error_type);
      }

      return payment;
    } catch (e) {
      removeTransactionToken();
      error.value = e;
      return null;
    }
  };

  const submitForm = async () => Frames.submitCard();

  const initCardForm = (params?: Omit<Configuration, 'publicKey'>) => {
    const localization = params?.card?.localization || getFramesLocalization();
    Frames.init({
      publicKey: getPublicKey(),
      style: params?.card?.styles || getFramesStyles(),
      ...(localization ? { localization } : {}),
      cardValidationChanged: () => {
        isCardValid.value = Frames.isCardValid();
      },
      cardTokenized: async ({ token }) => {
        setTransactionToken(token);
      },
      cardTokenizationFailed: (data) => {
        error.value = data;
        isCardValid.value = false;
      }
    });
  };

  const loadStoredPaymentInstruments = async (customerId: string) => {
    try {
      const { data } = await getCustomerCards({ customer_id: customerId });
      storedPaymentInstruments.value = data.payment_instruments;
    } catch (e) {
      error.value = e;
    }
  };

  const removePaymentInstrument = async (customerId: string, paymentInstrument: string) => {
    try {
      await removeSavedCard({ customer_id: customerId, payment_instrument_id: paymentInstrument });
      const { id: cardSrcId } = storedPaymentInstruments.value.find(card => card.payment_instrument_id === paymentInstrument);
      storedPaymentInstruments.value = storedPaymentInstruments.value.filter(instrument => instrument.payment_instrument_id !== paymentInstrument);
      if (cardSrcId === getTransactionToken()) {
        selectedPaymentMethod.value = CkoPaymentType.CREDIT_CARD;
        removeTransactionToken();
      }
    } catch (e) {
      error.value = e;
    }
  };

  const setPaymentInstrument = (token: string) => {
    setTransactionToken(token);
    selectedPaymentMethod.value = CkoPaymentType.SAVED_CARD;
  };

  return {
    error,
    submitDisabled,
    storedPaymentInstruments,
    submitForm,
    makePayment,
    initCardForm,
    setTransactionToken,
    loadStoredPaymentInstruments,
    removePaymentInstrument,
    setPaymentInstrument
  };
};
export default useCkoCard;
