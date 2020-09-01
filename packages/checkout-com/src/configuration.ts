const defaultConfig = {
  publicKey: null,
  ckoWebHookUrl: 'https://play-commercetools.cko-playground.ckotech.co/api',
  tokenizedCardKey: 'temporary-tokenized-card',
  saveInstrumentKey: 'save-instrument',
  card: {
    style: {},
    localization: null
  }
};

const config = {
  ...defaultConfig
};

interface CardConfiguration {
  style?: any;
  localization?: string | CustomLocalization;
}

interface Configuration {
  publicKey: string;
  ckoWebHookUrl?: string;
  tokenizedCardKey?: string;
  saveInstrumentKey?: string;
  card?: CardConfiguration;
}

interface CustomLocalization {
  cardNumberPlaceholder: string;
  expiryMonthPlaceholder: string;
  expiryYearPlaceholder: string;
  cvvPlaceholder: string;
}

const defaultStyles = {
  'card-number': {
    color: 'red'
  },
  base: {
    color: '#72757e',
    fontSize: '19px',
    minWidth: '60px'
  },
  invalid: {
    color: 'red'
  },
  placeholder: {
    base: {
      color: 'black',
      fontSize: '19px'
    }
  }
};

const setup = (params: Configuration) => {
  config.publicKey = params.publicKey;
  config.ckoWebHookUrl = params.ckoWebHookUrl || config.ckoWebHookUrl;
  config.card.style = params.card?.style || defaultStyles;
  config.card.localization = params.card?.localization || null;
  config.tokenizedCardKey = params.tokenizedCardKey || config.tokenizedCardKey;
  config.saveInstrumentKey = params.saveInstrumentKey || config.saveInstrumentKey;
};

const getPublicKey = () => config.publicKey;
const getCkoWebhookUrl = () => config.ckoWebHookUrl;
const getCkoProxyUrl = () => `${window.location.origin}/cko-api`;
const getFramesStyles = () => config.card.style;
const getFramesLocalization = () => config.card.localization;
const getTransactionTokenKey = () => config.tokenizedCardKey;
const getSaveInstrumentKey = () => config.saveInstrumentKey;

export { defaultConfig, setup, getPublicKey, getCkoWebhookUrl, getFramesStyles, getFramesLocalization, getCkoProxyUrl, getTransactionTokenKey, getSaveInstrumentKey, Configuration, CardConfiguration };
