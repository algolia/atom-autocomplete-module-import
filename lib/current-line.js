'use babel';

import escapeRegExp from 'lodash.escaperegexp';

const IMPORT_STATEMENT_REGEXP = /require|import|export\s+(?:\*|{[a-zA-Z0-9_$,\s]+})+\s+from|}\s*from\s*['"]/;

export default class {
  constructor(editor, bufferPosition, prefix) {
    this.line = editor.getTextInRange([
      [bufferPosition.row, 0],
      bufferPosition
    ]);
    this.prefix = prefix;
  }

  canBeAutocompleted() {
    if (!this.containsImportStatement()) {
      return false;
    }

    const packageNamePrefix = this.getPackageNamePrefix();
    if (!packageNamePrefix) {
      return false;
    }

    if (packageNamePrefix[0] === '.') {
      return false;
    }

    return true;
  }

  containsImportStatement() {
    return IMPORT_STATEMENT_REGEXP.test(this.line);
  }

  getPackageNamePrefix() {
    if (this.prefix.length === 0) {
      return false;
    }

    try {
      const realPrefixRegExp = new RegExp(
        `['"]((?:.+?)*${escapeRegExp(this.prefix)})`
      );
      const realPrefixMatches = realPrefixRegExp.exec(this.line);
      if (!realPrefixMatches) {
        return false;
      }
      const match = realPrefixMatches[1];

      if (match.indexOf(';') !== -1) {
        return false;
      }
      if (match.indexOf(')') !== -1) {
        return false;
      }
      if (match.indexOf('"') !== -1) {
        return false;
      }

      if (match.indexOf("'") !== -1) {
        return false;
      }

      return match;
    } catch (e) {
      return false;
    }
  }
}
