import path from 'path';
import {utimes, copy, readFile, outputFile} from 'fs-extra';
import test from 'ava';
import pTimeout from 'p-timeout';
import {run, watch, waitForRunComplete} from './helpers/karma';
import {tmp} from './helpers/utils';

test('Compile scss file', async t => {
  const {success, error, disconnected} = await run(['test/fixtures/basic.scss', 'test/fixtures/styles.test.js']);

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(success, 1, 'Expected 1 test successful');
});

test('Compile scss file with custom preprocessor', async t => {
  const {success, error, disconnected} = await run(['test/fixtures/basic.custom.scss', 'test/fixtures/styles.test.js']);

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(success, 1, 'Expected 1 test successful');
});

test('Log error on invalid scss file', async t => {
  const {error, disconnected, exitCode} = await run('test/fixtures/error.scss');

  t.ifError(disconnected, 'Karma disconnected');
  t.true(error, 'Expected an error to be returned');
  t.is(exitCode, 1, 'Expected non zero exit code');
});

test('Re-compile scss file when dependency is modified', async t => {
  const dir = path.resolve(tmp());
  const fixture = path.join(dir, 'with-partial.scss');
  const includePath = path.join(dir, 'partials');
  const partial = path.join(includePath, '_partial.scss');

  await Promise.all([
    copy('test/fixtures/partials/_partial.scss', partial),
    copy('test/fixtures/with-partial.scss', fixture),
  ]);

  const server = await watch([fixture, 'test/fixtures/styles.test.js'], {
    options: {includePaths: [includePath, 'test/fixtures/partials']},
  });

  try {
    let {success, error, disconnected} = await waitForRunComplete(server);

    t.ifError(error, 'Karma returned an error');
    t.ifError(disconnected, 'Karma disconnected');
    t.is(success, 1, 'Expected 1 test successful');

    utimes(partial, Date.now(), Date.now());
    ({success, error, disconnected} = await waitForRunComplete(server));

    t.ifError(error, 'Karma returned an error');
    t.ifError(disconnected, 'Karma disconnected');
    t.is(success, 1, 'Expected 1 test successful');
  } finally {
    await server.emitAsync('exit');
  }
});

test('Do not recompile scss file when dependency is not imported anymore', async t => {
  const dir = path.resolve(tmp());
  const fixture = path.join(dir, 'with-partial.scss');
  const includePath = path.join(dir, 'partials');
  const partial = path.join(includePath, '_partial.scss');
  const partialAlt = path.join(includePath, '_partial-alt.scss');

  await Promise.all([
    copy('test/fixtures/partials/_partial.scss', partial),
    copy('test/fixtures/partials/_partial.scss', partialAlt),
    copy('test/fixtures/with-partial.scss', fixture),
  ]);

  const server = await watch([fixture, 'test/fixtures/styles.test.js'], {
    options: {includePaths: [includePath, 'test/fixtures/partials']},
  });

  try {
    let {success, error, disconnected} = await waitForRunComplete(server);

    t.ifError(error, 'Karma returned an error');
    t.ifError(disconnected, 'Karma disconnected');
    t.is(success, 1, 'Expected 1 test successful');

    await outputFile(
      fixture,
      (await readFile(fixture)).toString().replace(`@import 'partial';`, `@import 'partial-alt';`)
    );
    ({success, error, disconnected} = await waitForRunComplete(server));
    t.ifError(error, 'Karma returned an error');
    t.ifError(disconnected, 'Karma disconnected');
    t.is(success, 1, 'Expected 1 test successful');

    await utimes(partial, Date.now(), Date.now());
    await t.throws(waitForRunComplete(server), pTimeout.TimeoutError);
  } finally {
    await server.emitAsync('exit');
  }
});
