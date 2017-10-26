'use babel';

import algolia from 'algoliasearch/lite';
import Package from './package';
import { version as pluginVersion, name as pluginName } from '../package.json';

const ALGOLIA_APP_ID = 'OFCNCOG2CU';
const ALGOLIA_API_KEY = '1f8e2003b37f05e088cf6a03d54a5ebd';
const ALGOLIA_INDEX_NAME = 'npm-search';

export default class {
  constructor() {
    const client = algolia(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    client.addAlgoliaAgent(
      `atom-autocomplete-module-import (${pluginVersion})`
    );
    client.setExtraHeader(
      'referer',
      'https://github.com/algolia/atom-autocomplete-module-import/'
    );
    this.index = client.initIndex(ALGOLIA_INDEX_NAME);
  }

  search(query) {
    return new Promise((resolve, reject) => {
      this.index.search(
        {
          query,
          attributesToRetrieve: [
            'name',
            'description',
            'humanDownloadsLast30Days',
            'license',
            'version'
          ],
          attributesToHighlight: [],
          analyticsTags: [`atom-${pluginName}`]
        },
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            const packages = response.hits.map(hit => {
              return new Package(hit);
            });
            resolve(packages);
          }
        }
      );
    });
  }
}
