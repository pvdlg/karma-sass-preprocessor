import path from 'path';
import test from 'ava';
import run from './helpers/run';

// eslint-disable-next-line no-magic-numbers
process.setMaxListeners(15);

test('Compile scss file', async t => {
  const {success, failed, error, disconnected, exitCode} = await run('Basic scss', 'test/fixtures/basic.scss');

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile sass file', async t => {
  const {success, failed, error, disconnected, exitCode} = await run('Scss file', 'test/fixtures/basic.sass');

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with custom preprocessor', async t => {
  const {success, failed, error, disconnected, exitCode} = await run(
    'Scss file with custom preprocessor',
    'test/fixtures/basic.custom.scss'
  );

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with sourcemap (options.sourceMap)', async t => {
  const {
    success,
    failed,
    error,
    disconnected,
    exitCode,
  } = await run('Scss file with sourcemap (options.sourceMap)', 'test/fixtures/basic.scss', {
    options: {sourceMap: true},
  });

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with sourcemap (options.map)', async t => {
  const {
    success,
    failed,
    error,
    disconnected,
    exitCode,
  } = await run('Scss file with sourcemap (options.sourceMap)', 'test/fixtures/basic.scss', {
    options: {map: true},
  });

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with partial import', async t => {
  const {
    success,
    failed,
    error,
    disconnected,
    exitCode,
  } = await run('Scss file with partial import', 'test/fixtures/with-partial.scss', {
    options: {includePaths: ['test/fixtures/partials']},
  });

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with options', async t => {
  const {
    success,
    failed,
    error,
    disconnected,
    exitCode,
  } = await run('Scss file with options', 'test/fixtures/basic.scss', {
    options: {precision: 8, sourceComments: true, outputStyle: 'compressed'},
  });

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with non css extension', async t => {
  const {success, failed, error, disconnected, exitCode} = await run(
    'Scss file with non css extension',
    'test/fixtures/basic.txt'
  );

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with non css extension and custom transformPath', async t => {
  const {
    success,
    failed,
    error,
    disconnected,
    exitCode,
  } = await run('Scss file with non css extension and custom transformPath', 'test/fixtures/basic.txt', {
    transformPath: filePath => filePath.replace(/\.(txt)$/, '.css').replace('fixtures/', ''),
  });

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with non css extension, custom transformPath and custom preprocessor', async t => {
  const {
    success,
    failed,
    error,
    disconnected,
    exitCode,
  } = await run(
    'Scss file with non css extension, custom transformPath and custom preprocessor',
    'test/fixtures/basic.custom.txt',
    {transformPath: filePath => filePath.replace(/\.(txt)$/, '.css').replace('fixtures/', '')}
  );

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with no extension', async t => {
  const {success, failed, error, disconnected, exitCode} = await run(
    'Scss file with no extension',
    'test/fixtures/basic'
  );

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Log error on invalid scss file', async t => {
  const {success, failed, error, disconnected, exitCode} = await run(
    'Invalid scss file',
    'test/fixtures/error.scss',
    {},
    true
  );

  t.ifError(disconnected, 'Karma disconnected');
  t.true(error, 'Expected an error to be returned');
  t.is(exitCode, 1, 'Expected non zero exit code');
  t.is(success, 0, 'Expected no test successful');
  t.is(failed, 0, 'Expected no failed test');
});
