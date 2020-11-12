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
import 'react-datepicker/dist/react-datepicker.css';

import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
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
  initGTM,
} from './Library';
import reportWebVitals from './reportWebVitals';

initGTM();

const store = configureStore();

const AppWithTranslationWithoutState: React.FC<{locals: AvailableLanguage}> = ({
  locals
}) => (
  <IntlProvider {...locals.intl}>
    <App />
    <Alerts />
  </IntlProvider>
);

const AppWithTranslation = connect((state: GlobalState) => ({
  locals: state.locals,
}))(AppWithTranslationWithoutState);

const AppWithState = () => 
  <Provider store={store}>
    <ConnectedRouter history={history} >
      <AppWithTranslation />
    </ConnectedRouter>
  </Provider>

ReactDOM.render(
  <ConfigProvider config={defaultConfig()}>
    <AppWithState />
  </ConfigProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();