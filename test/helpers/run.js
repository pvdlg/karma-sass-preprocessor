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

const KARMA_CONFIG = {
  basePath: '',
  frameworks: ['jasmine-jquery', 'jasmine'],
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
  plugins: [
    'karma-jasmine',
    'karma-phantomjs-launcher',
    'karma-jasmine-jquery',
    'karma-jasmine',
    'karma-babel-preprocessor',
    karmaSassPreprocessor,
  ],
};

async function createTest(description, fixture, sassOpts = {}) {
  if (sassOpts.sourceMap) {
    sassOpts.sourceMap = true;
    sassOpts.sourceMapEmbed = true;
  }
  const result = handlebars.compile(await readFile(path.resolve('test/helpers/test-template.hbs'), 'utf-8'))({
    description,
    fixture: fixture.replace(/\.(scss|sass)$/, '.css'),
    expected: escape((await pify(sass.render)(Object.assign(sassOpts, {file: path.resolve(fixture)}))).css),
  });
  const expected = tmp(`${path.basename(fixture, path.extname(fixture))}.test.js`);

  await outputFile(expected, result);
  return expected;
}

export default async function run(description, fixture, options, noTest = false) {
  const server = new Server(
    Object.assign(KARMA_CONFIG, {
      files: [fixture].concat(noTest ? [] : await createTest(description, fixture, options)),
      sassPreprocessor: {options},
      customPreprocessors: {custom_sass: {base: 'sass', options: {options}}},
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
