'use babel';

import fs from 'fs';
import { spawn } from 'child_process';

export default class {
  constructor(projectPath) {
    this.path = projectPath;
  }

  hasPackageFile() {
    return fs.existsSync(`${this.path}/package.json`);
  }

  alreadyKnowsPackage(name) {
    const content = fs.readFileSync(`${this.path}/package.json`);
    const info = JSON.parse(content);
    const allDependencies = Object.assign(
      {},
      info.dependencies,
      info.devDependencies,
      info.peerDependencies,
      info.optionalDependencies
    );

    return name in allDependencies;
  }

  async addPackage(name) {
    if (this.isUsingYarn()) {
      await this.runCommand('yarn', ['add', name]);
    } else {
      await this.runCommand('npm', ['install', name]);
    }
  }

  runCommand(name, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(name, args, { cwd: this.path });

      process.stdout.on('data', data => {
        console.log(`stdout: ${data}`); // eslint-disable-line
      });

      process.stderr.on('data', data => {
        console.log(`stderr: ${data}`); // eslint-disable-line
      });

      process.on('close', code => {
        console.log(`child process exited with code ${code}`); // eslint-disable-line
        if (code === 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    });
  }

  async addDevPackage(name) {
    if (this.isUsingYarn()) {
      await this.runCommand('yarn', ['add', name, '--dev']);
    } else {
      await this.runCommand('npm', ['install', name, '--save-dev']);
    }
  }

  async addPeerPackage(name) {
    if (this.isUsingYarn()) {
      await this.runCommand('yarn', ['add', name, '--peer']);
    } else {
      throw new Error(
        'npm does not provide a command to add a peer dependency.'
      );
    }
  }

  async addOptionalPackage(name) {
    if (this.isUsingYarn()) {
      await this.runCommand('yarn', ['add', name, '--optional']);
    } else {
      await this.runCommand('npm', ['install', '--save-optional', name]);
    }
  }

  isUsingYarn() {
    return fs.existsSync(`${this.path}/yarn.lock`);
  }
}
