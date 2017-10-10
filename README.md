# ⚛️ Atom Autocomplete Module Import

> Search & install NPM packages from import/require statements powered by Algolia.

![demo](http://g.recordit.co/d5viUB8XY7.gif)

[Changelog](https://github.com/algolia/atom-autocomplete-module-import/blob/master/CHANGELOG.md)

## Features

This Atom Plugin allows you to quickly find and install any npm module as you are writing your `require()` / `import` statements:

  * **Fast** & **Relevant** [autocomplete search powered by Algolia][1].
  * Install modules without having to leave Atom.
  * Yarn and NPM support.
  * Save package as `dependencies`, `devDependencies`, `peerDependencies` or `optionalDependencies`.
  * Support for `require()` and ES2015 import module syntax.

You can read more about the story behind in [this][2] blog post.

## Installation

```
apm install autocomplete-module-import
```

## Usage

In a JavaScript file type `require('` (or `from '`) and the plugin will automatically suggest relevant packages from the NPM registry.

Once you confirm your selection, the plugin will ask if you want to install the dependency if it's not already installed.


## Copyright and license

Copyright (c) 2017 Algolia. Code released under the [MIT license](https://github.com/algolia/atom-autocomplete-module-import/blob/master/LICENSE.md).

[1]: https://www.algolia.com
[2]: https://blog.algolia.com/atom-plugin-install-npm-module/
