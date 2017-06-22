'use babel';

export default class {
  constructor(data) {
    this.data = data;
  }

  get name() {
    return this.data.name;
  }

  get description() {
    return this.data.description;
  }

  get last30DaysDownloads() {
    return this.data.humanDownloadsLast30Days;
  }

  get license() {
    return this.data.license;
  }

  get version() {
    return this.data.version;
  }
}
