const fs = require('fs');
const path = require('path');
const util = require('util');
const childProcess = require('child_process');
const chalk = require('chalk');

const asyncRimraf = require('rimraf');
const asyncGitClone = require('git-clone');
const asyncCopyDirectory = require('ncp');

const templateURL = "https://github.com/rewieer/zedix-template";
const localURL = path.resolve(__dirname, "../../zedix-template");

const gitClone = util.promisify(asyncGitClone);
const rmRf = util.promisify(asyncRimraf);
const copyDirectory = util.promisify(asyncCopyDirectory);
const exec = util.promisify(childProcess.exec);

const cloneTemplateRepository = (from, to, isLocal) => {
  if (isLocal) {
    return copyDirectory(from, to);
  }

  return gitClone(templateURL, to, null)
};

module.exports = async function(config) {
  const currentPath = process.cwd();
  const appPath = path.resolve(currentPath, config.name);

  if (fs.existsSync(appPath)) {
    console.error("A file at " + appPath + " already exists. Aborting !");
    return 0;
  }

  fs.mkdirSync(appPath);

  console.log(chalk.yellow("Cloning the template..."));
  try {
    await cloneTemplateRepository(templateURL, appPath, false )
  } catch (e) {
    console.warn(e);
    return 0;
  }

  await rmRf(path.resolve(appPath, ".git"));

  console.log(chalk.yellow("Installing dependencies..."));

  try {
    const { stdout, stderr } = await exec('cd ' + config.name + ' && npm install');
  } catch (e) {
    console.warn(e);
    return 0;
  }

  console.log(chalk.yellow("ZX has correctly been setup !"));
  console.log(chalk.yellow("But it's not ready yet ! Please read the instructions in README.md to get started :)"))
};
