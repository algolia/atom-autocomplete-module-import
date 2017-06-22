'use babel';

export default class {
  constructor(pkg) {
    this.package = pkg;
  }

  get text() {
    return this.package.name;
  }

  get description() {
    return this.package.description;
  }

  get rightLabelHTML() {
    const license = this.package.license
      ? `<span style="border: 1px solid #484848; border-radius: 2px; padding: 2px 3px; font-size: 0.9em;">${this
          .package.license}</span>`
      : '';

    return `
      <span>
        <img src="https://yarnpkg.com/assets/detail/ico-downloads.svg" width="17" height="17"/>
        ${this.package.last30DaysDownloads}
        ${license}
        <strong> ${this.package.version}</strong>
      </span>
    `;
  }

  get descriptionMoreURL() {
    return `https://yarnpkg.com/en/package/${this.package.name}`;
  }

  get type() {
    return 'import';
  }
}
