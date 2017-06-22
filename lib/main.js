'use babel';

import SuggestionsProvider from './suggestions-provider';
import PackagesIndex from './packages-index';

export const activate = function() {};

export const getProvider = function() {
  const packagesIndex = new PackagesIndex();

  return new SuggestionsProvider(packagesIndex);
};
