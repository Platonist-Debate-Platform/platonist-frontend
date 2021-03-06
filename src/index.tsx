import './Assets/Sass/index.scss';
import './Library/Fonts/amplesoft';
import './Library/Fonts/icons';
import '@fortawesome/fontawesome-free/css/all.css';
import 'core-js/es/map';
import 'core-js/es/object/assign';
import 'core-js/es/object/set-prototype-of';
import 'core-js/es/object/values';
import 'core-js/es/set';
import 'raf/polyfill';

import { ConnectedRouter } from 'connected-react-router';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';

import App from './App/App';
import {
  Alerts,
  AvailableLanguage,
  ConfigProvider,
  configureStore,
  defaultConfig,
  GlobalState,
  history,
  isProduction,
  isStaging,
  isTest,
} from './Library';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// initGTM();

const store = configureStore();

const AppWithTranslationWithoutState: FunctionComponent<{
  locals: AvailableLanguage;
}> = ({ locals }) => (
  <IntlProvider {...locals.intl}>
    <App />
    <Alerts />
  </IntlProvider>
);

const AppWithTranslation = connect((state: GlobalState) => ({
  locals: state.locals,
}))(AppWithTranslationWithoutState);

const AppWithState: FunctionComponent = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppWithTranslation />
    </ConnectedRouter>
  </Provider>
);

export const BaseApp: FunctionComponent = () => (
  <ConfigProvider config={defaultConfig()}>
    <AppWithState />
  </ConfigProvider>
);

if (!isTest) {
  ReactDOM.render(<BaseApp />, document.getElementById('root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  if (isProduction || isStaging) {
    serviceWorkerRegistration.register();
  } else {
    serviceWorkerRegistration.unregister();
  }

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
