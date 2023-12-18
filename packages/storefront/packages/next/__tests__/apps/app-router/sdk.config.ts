/* eslint-disable import/no-relative-packages */
import { exampleSdkModule } from "@storefront/shared";
import { CreateSdkOptions, createSdk } from "@vue-storefront/next";

const options: CreateSdkOptions = {
  middleware: {
    apiUrl: "http://localhost:4000/",
  },
};

export const { getSdk, createSdkContext } = createSdk(
  options,
  ({ buildModule, middlewareUrl, getRequestHeaders }) => ({
    example: buildModule(exampleSdkModule, {
      apiUrl: `${middlewareUrl}test_integration`,
      headers: getRequestHeaders(),
    }),
  })
);
