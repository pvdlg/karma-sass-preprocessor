import path from 'path';
import {readFile, outputFile} from 'fs-extra';
import sass from 'node-sass';
import handlebars from 'handlebars';
import pify from 'pify';
import escape from 'js-string-escape';
import pEvent from 'p-event';
import {Server, constants} from 'karma';
import karmaSassPreprocessor from '../../lib/index';
import tmp from './tmp';

/**
 * Base Karma configuration tu run preprocessor.
 * 
 * @type {Object}
 */
const KARMA_CONFIG = {
  basePath: '',
  frameworks: ['jasmine-jquery'],
  preprocessors: {
    'test/fixtures/**/!(*custom).+(scss|sass)': ['sass'],
    'test/fixtures/**/*custom.+(scss|sass)': ['custom_sass'],
    'test/fixtures/**/*.test.js': ['babel'],
  },
  babelPreprocessor: {options: {babelrc: false, presets: ['es2015'], sourceMap: 'inline'}},
  colors: true,
  logLevel: constants.LOG_DISABLE,
  browsers: ['PhantomJS'],
  singleRun: true,
  plugins: ['@metahub/karma-jasmine-jquery', 'karma-*', karmaSassPreprocessor],
};

/**
 * Write a Jasmine JS test file based on `test-template.hbs`. The test load the compiled file corresponding to `fixture` and compare it's content with the expected result (compiled outside of the preprocessor).
 * 
 * @method createTest
 * @param {string} description description of the Jasmine test to create.
 * @param {string} fixture path of the scss/sass file that will be compiled externaly and by the preprocessor to be compared.
 * @param {Object} [options={}] node-sass options to pass to the preprocessor configuration.
 * @return {string} the path of the JS test file to be used by Karma.
 */
async function createTest(description, fixture, options = {}) {
  if (options.sourceMap) {
    options.sourceMap = true;
    options.sourceMapEmbed = true;
  }
  const script = handlebars.compile(await readFile(path.resolve('test/helpers/test-template.hbs'), 'utf-8'))({
    description,
    fixture: fixture.replace(/\.(scss|sass)$/, '.css'),
    expected: escape((await pify(sass.render)(Object.assign(options, {file: path.resolve(fixture)}))).css),
  });
  const filePath = tmp(`${path.basename(fixture, path.extname(fixture))}.test.js`);

  await outputFile(filePath, script);
  return filePath;
}

/**
 * @typedef {Object} KarmaOutput
 * @property {Number} success
 * @property {Number} failed
 * @property {Boolean} error
 * @property {Boolean} disconnected
 * @property {Boolean} exitCode
 * @property {String} errMsg
 */

/**
 * Run Karma with:
 * - Base Karma configuration {@link KARMA_CONFIG}
 * - Sass/scss to compile with the preprocessor
 * - Jasmine JS test file created by {@link createTest}
 * - preprocessor options
 * 
 * @method run
 * @param {string} description description of the Jasmine test to create.
 * @param {string} fixture path of the scss/sass file that will be compiled externaly and by the preprocessor to be compared.
 * @param {Object} [options] node-sass options to pass to the preprocessor configuration.
 * @param {Boolean} [noTest=false] `true` to not include a Jasmine test (i.e. to test expected error).
 * @return {Promise<KarmaOutput>} A `Promise` that resolve to the Karma execution results.
 */
export default async function run(description, fixture, options, noTest = false) {
  const server = new Server(
    Object.assign(KARMA_CONFIG, {
      files: [fixture].concat(noTest ? [] : await createTest(description, fixture, options)),
      sassPreprocessor: {options},
      customPreprocessors: {custom_sass: {base: 'sass', options}},
    }),
    () => 0
  );
  const promise = pEvent(server, 'run_complete', {multiArgs: true, rejectionEvents: ['browser_error']})
    .then(result => result[1])
    .catch(result => {
      const {success, failed, error, disconnected} = result[0].lastResult;

      return {success, failed, error, disconnected, exitCode: 1, errMsg: result[1]};
    });

  server.start();
  return promise;
}
