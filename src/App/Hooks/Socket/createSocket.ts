import { createApiUrl, defaultConfig } from 'platonist-library';
import io from 'socket.io-client';

export const createSocket = () => {
  const config = defaultConfig();
  const url = createApiUrl(config.api.config);

  return io(url.href);
};
