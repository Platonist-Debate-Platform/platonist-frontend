import { ApiConfig, ApiProtocol, AppEnvKeys, Breakpoint, BreakpointTypes, DefaultConfig } from './Types';

const env = process.env;

export const isDevelopment = (env.NODE_ENV as AppEnvKeys) === AppEnvKeys.Development ? true : false;
export const isProduction = (env.NODE_ENV as AppEnvKeys) === AppEnvKeys.Production ? true : false;
export const isLocalhost = 
  window && 
  window.location && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const resolveApiUrl = (environment: AppEnvKeys) => {
  switch (environment) {
    case AppEnvKeys.Staging:
      return 'staging-api.globalctgroup.com';
    case AppEnvKeys.Production: 
      return 'api.globalctgroup.com';
    case AppEnvKeys.Development:
    default:
      return 'staging-api.globalctgroup.com';
  }
};

export const apiConfig: ApiConfig = {
  protocol: ApiProtocol.Https, // isDevelopment ? ApiProtocol.Http : ApiProtocol.Https,
  url: env.REACT_APP_API || resolveApiUrl(env.NODE_ENV as AppEnvKeys),
  path: '',
  port: undefined, // isDevelopment ? 1337 : undefined,
};


export const createApiUrl = ({
  path,
  port,
  protocol,
  url
}: ApiConfig = apiConfig) => new URL(path || '', `${protocol}://${url}${(port && ':' + port) || ''}${path && '/' + path}`);

export const breakpoints: Breakpoint[] = [{
  type: BreakpointTypes.Xxs,
  size: 370,
}, {
  type: BreakpointTypes.Xs,
  size: 576,
}, {
  type: BreakpointTypes.Sm,
  size: 768,
},{
  type: BreakpointTypes.Md,
  size: 992,
}, {
  type: BreakpointTypes.Lg,
  size: 1200,
},{
  type: BreakpointTypes.Xl,
  size: 1550,
}];

export const defaultConfig = (): DefaultConfig => ({
  api: {
    config: apiConfig,
    createApiUrl,
    url: createApiUrl(apiConfig),
  },
  breakpoints,
  cookieNames: {
    signInRedirect: 'sign-in-redirect',
  },
  env: {
    host: env.REACT_APP_HOST || 'localhost',
    protocol: env.REACT_APP_HTTPS === 'true' ? ApiProtocol.Https : ApiProtocol.Http,
    port: (env.REACT_APP_PORT && Number(env.REACT_APP_PORT)) || 3000,
    publicUrl: env.REACT_APP_PUBLIC_URL && env.REACT_APP_PUBLIC_URL.length > 0 ? env.REACT_APP_PUBLIC_URL : undefined,
  },
  isDevelopment,
  isLocalhost,
});