export interface MiddlewareConfig {
  apiUrl: string;
  ssrApiUrl?: string;
}

export interface MultistoreConfig {
  enabled: boolean;
}

export interface SdkModuleOptions {
  middleware: MiddlewareConfig;
  multistore?: MultistoreConfig;
}
