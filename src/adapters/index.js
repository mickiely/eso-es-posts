import { facebookAdapter } from './facebook.js';
import { instagramAdapter } from './instagram.js';

/** @type {Record<string, import('./adapter-interface.js').Adapter>} */
export const adapters = {
  facebook: facebookAdapter,
  instagram: instagramAdapter,
};

export { RetryableAdapterError } from './adapter-interface.js';
