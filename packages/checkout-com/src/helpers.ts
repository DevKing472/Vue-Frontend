/* eslint-disable */
interface PaymentPropeties {
    context_id: string,
    save_payment_instrument?: boolean,
    secure3d?: boolean,
    success_url?: string,
    failure_url?: string,
    token?: string
}

interface PaymentMethodPayload extends PaymentPropeties {
    type: string,
    id?: string,
    authorization_token?: string
}

enum CKO_PAYMENT_TYPE {
    CREDIT_CARD = 1,
    SAVED_CARD,
    KLARNA,
    PAYPAL
}

const buildBasePaymentMethodPayload = ({ context_id, save_payment_instrument, secure3d, success_url, failure_url }: PaymentPropeties) => ({
    context_id,
    ...(save_payment_instrument ? { save_payment_instrument } : {}),
    ...(secure3d ? { '3ds': secure3d } : {}),
    ...(success_url ? { success_url } : {}),
    ...(failure_url ? { failure_url } : {})
})

const buildPaymentPayloadStrategies = {
    [CKO_PAYMENT_TYPE.CREDIT_CARD]: (properties: PaymentPropeties): PaymentMethodPayload => ({
        ...buildBasePaymentMethodPayload(properties),
        type: 'token',
        token: properties.token
    }),
    [CKO_PAYMENT_TYPE.SAVED_CARD]: (properties: PaymentPropeties): PaymentMethodPayload => ({
        ...buildBasePaymentMethodPayload(properties),
        type: 'id',
        token: properties.token
    }),
    [CKO_PAYMENT_TYPE.KLARNA]: (properties: PaymentPropeties): PaymentMethodPayload => ({
        ...buildBasePaymentMethodPayload(properties),
        type: 'klarna',
        token: properties.token
    }),
    [CKO_PAYMENT_TYPE.PAYPAL]: (properties: PaymentPropeties): PaymentMethodPayload => ({
        ...buildBasePaymentMethodPayload(properties),
        type: 'paypal'
    })
};

export { CKO_PAYMENT_TYPE, buildPaymentPayloadStrategies, PaymentPropeties, PaymentMethodPayload };
