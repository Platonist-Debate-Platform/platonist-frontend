import TagManager, { TagManagerArgs } from 'react-gtm-module';
import { isProduction } from '../Config';

export const initGTM = () => {
  if (isProduction) {
    const tagManagerArgs: TagManagerArgs = {
      gtmId: 'GTM-TC487TQ',
    };

    setTimeout(() => {
      TagManager.initialize(tagManagerArgs);
    }, 2000);
  }
};