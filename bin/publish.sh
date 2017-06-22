#!/bin/bash

set -eu

readonly CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != master ]; then
  echo "You must be on 'master' branch to publish a release, aborting..."
  exit 1
fi

if ! git diff-index --quiet HEAD --; then
  echo "Working tree is not clean, aborting..."
  exit 1
fi

readonly PACKAGE_VERSION=$(< package.json grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[:space:]')

git tag "v$PACKAGE_VERSION"

git push --tags

apm publish --tag "v$PACKAGE_VERSION"

echo "Pushed package to atom.io, and also pushed 'v$PACKAGE_VERSION' tag to git repository."
