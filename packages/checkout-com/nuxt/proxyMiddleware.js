const axios = require('axios');
const express = require('express');
const app = express();

let ckoPublicKey = null;
let ckoSecretKey = null;
let ckoCtApiUrl = null;

app.use(express.json());

const sendJsonResponse = (res, json) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(json);
};

const sendError = (res, errorCode, errorMessage) => res.status(errorCode).send(errorMessage);

const apiRequestHeaders = (ckoSecretKey) => ({
  headers: {
    authorization: ckoSecretKey,
    'Content-Type': 'application/json'
  }
});
const getStoredMethods = async ({ ckoPublicKey, ckoSecretKey, customerId }) => {
  try {
    const { data } = await axios.get(
      `${ckoCtApiUrl}/merchants/${ckoPublicKey}/customers/${customerId}`,
      apiRequestHeaders(ckoSecretKey)
    );
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const removeStoredMethod = async ({ ckoPublicKey, ckoSecretKey, customerId, paymentInstrumentId }) => {
  try {
    return await axios.delete(
      `${ckoCtApiUrl}/merchants/${ckoPublicKey}/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
      apiRequestHeaders(ckoSecretKey)
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};

app.post('/', async (req, res) => {
  const data = await getStoredMethods({ ckoPublicKey, ckoSecretKey, customerId: req.body.customer_id });
  if (data) {
    return sendJsonResponse(res, JSON.stringify({
      // eslint-disable-next-line
      payment_instruments: [
        ...data.payment_instruments.filter((value, index, self) => {
          return self.findIndex(el => el.id === value.id) === index;
        })
      ]
    }));
  }
  return sendError(res, 400, 'Could not load customer\'s stored payment instruments');
});

app.delete('/:customerId/:paymentInstrumentId', async (req, res) => {
  const response = await removeStoredMethod({
    ckoPublicKey,
    ckoSecretKey,
    customerId: req.params.customerId,
    paymentInstrumentId: req.params.paymentInstrumentId
  });
  if (response) {
    return sendJsonResponse(res, JSON.stringify({}));
  }
  return sendError(res, 400, 'Could not remove stored payment instrument');
});

export default ({ publicKey, secretKey, ctApiUrl }) => {
  ckoPublicKey = publicKey;
  ckoSecretKey = secretKey;
  ckoCtApiUrl = ctApiUrl;
  return app;
};
