'use babel';

import Project from './project';
import Suggestion from './suggestion';
import CurrentLine from './current-line';
import pkgUp from 'pkg-up';
import path from 'path';

export default class {
  constructor(packagesIndex) {
    this.packagesIndex = packagesIndex;
    // This will work on JavaScript and CoffeeScript files, but not in js comments.
    this.selector = '.source.js, .source.ts, .source.tsx, .source.coffee';
    this.disableForSelector =
      '.source.js .comment, .source.ts .comment, .source.tsx .comment, .source.coffee .comment';

    // This will take priority over the default provider, which has a priority of 0.
    // `excludeLowerPriority` will suppress any providers with a lower priority
    // i.e. The default provider will be suppressed
    this.inclusionPriority = 1;
    this.excludeLowerPriority = false;
  }

  async getSuggestions({ editor, bufferPosition, prefix }) {
    const currentLine = new CurrentLine(editor, bufferPosition, prefix);
    if (!currentLine.canBeAutocompleted()) {
      return [];
    }

    const packageNamePrefix = currentLine.getPackageNamePrefix();

    const packages = await this.packagesIndex.search(packageNamePrefix);
    const suggestions = packages.map(pkg => {
      return new Suggestion(pkg);
    });

    return suggestions;
  }

  async onDidInsertSuggestion({ editor, suggestion }) {
    if (!editor.buffer.file) {
      // This means the file is only in the buffer.
      // In this case we can't suggest to install
      // the module given we don't know how to locate
      // the package.json.

      return;
    }
    const packageFilePath = await pkgUp(editor.buffer.file.path);
    if (packageFilePath === null) {
      atom.notifications.addError("Couldn't find your package.json file.", {
        dismissable: true
      });
      return;
    }

    const projectRootDir = path.dirname(packageFilePath);

    const project = new Project(projectRootDir);
    const pkg = suggestion.package;

    if (project.alreadyKnowsPackage(pkg.name)) {
      return;
    }

    atom.notifications.addInfo(`Install "<b>${pkg.name}</b>"?`, {
      buttons: [
        {
          onDidClick: async function() {
            try {
              await project.addPackage(pkg.name);
            } catch (error) {
              atom.notifications.addError('Failed to add package.', {
                stack: error.stack,
                detail: error.message,
                dismissable: true
              });
            }
            this.removeNotification();
          },
          text: "Install & add to 'dependencies'"
        },
        {
          onDidClick: async function() {
            try {
              await project.addDevPackage(pkg.name);
            } catch (error) {
              atom.notifications.addError('Failed to add dev package.', {
                stack: error.stack,
                detail: error.message,
                dismissable: true
              });
            }
            this.removeNotification();
          },
          text: "Install & add to 'devDependencies'"
        },
        {
          onDidClick: async function() {
            try {
              await project.addOptionalPackage(pkg.name);
            } catch (error) {
              atom.notifications.addError('Failed to add optional package.', {
                stack: error.stack,
                detail: error.message,
                dismissable: true
              });
            }
            this.removeNotification();
          },
          text: "Install & add to 'optionalDependencies'"
        },
        {
          onDidClick: async function() {
            try {
              await project.addPeerPackage(pkg.name);
            } catch (error) {
              atom.notifications.addError('Failed to add peer package.', {
                stack: error.stack,
                detail: error.message,
                dismissable: true
              });
            }
            this.removeNotification();
          },
          text: "Add to 'peerDependencies'"
        }
      ],
      dismissable: true
    });
  }
}
