import { Context } from './../../types';

interface ContextConfiguration {
  useVSFContext: () => Context;
}

interface ApplyingContextHooks {
  before: (args: any[]) => any[];
  after: (response: any) => any;
}

let useVSFContext = () => ({}) as Context;

const configureContext = (config: ContextConfiguration) => {
  useVSFContext = config.useVSFContext || useVSFContext;
};

const NOP = (x) => x;
const applyContextToApi = (
  api: Record<string, Function>,
  context: any,

  /**
   * By default we use NOP function for returning the same parameters as they come.
   * It's useful in extensions, when someone don't want to inject into changing arguments or the response,
   * in that case, we use default function, to handle that scenario - NOP
   */
  hooks: ApplyingContextHooks = { before: NOP, after: NOP }
) =>
  Object.entries(api)
    .reduce((prev, [key, fn]: any) => ({
      ...prev,
      [key]: async (...args) => hooks.after(await fn(context, ...hooks.before(args)))
    }), {});

const generateContext = (factoryParams) => {
  const context = useVSFContext();

  if (factoryParams.provide) {
    const generatedSetup = factoryParams.provide();

    return { ...context.$vsf, ...generatedSetup };
  }

  return context.$vsf;
};

export {
  generateContext,
  useVSFContext,
  configureContext,
  applyContextToApi
};
