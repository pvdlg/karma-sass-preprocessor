import test from 'ava';
import run from './helpers/run';

test('Compile scss file', async t => {
  const fixture = 'test/fixtures/basic.scss';
  const {success, failed, error, disconnected, exitCode} = await run('Basic scss', fixture);

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile sass file', async t => {
  const fixture = 'test/fixtures/basic.sass';
  const {success, failed, error, disconnected, exitCode} = await run('Scss file', fixture);

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with custom preprocessor', async t => {
  const fixture = 'test/fixtures/basic.custom.scss';
  const {success, failed, error, disconnected, exitCode} = await run('Scss file with custom preprocessor', fixture);

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with sourcemap', async t => {
  const fixture = 'test/fixtures/basic.scss';
  const {success, failed, error, disconnected, exitCode} = await run('Scss file with sourcemap', fixture, {
    sourceMap: true,
  });

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with partial import', async t => {
  const fixture = 'test/fixtures/with-partial.scss';
  const sassOpts = {
    includePaths: ['test/fixtures/partials'],
  };
  const {success, failed, error, disconnected, exitCode} = await run(
    'Scss file with partial import',
    fixture,
    sassOpts
  );

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Compile scss file with options', async t => {
  const fixture = 'test/fixtures/basic.scss';
  const sassOpts = {
    precision: 8,
    sourceComments: true,
    outputStyle: 'compressed',
  };
  const {success, failed, error, disconnected, exitCode} = await run('Scss file with options', fixture, sassOpts);

  t.ifError(error, 'Karma returned an error');
  t.ifError(disconnected, 'Karma disconnected');
  t.is(exitCode, 0, 'Expected zero exit code');
  t.is(success, 1, 'Expected 1 test successful');
  t.is(failed, 0, 'Expected no failed test');
});

test('Log error on invalid scss file', async t => {
  const fixture = 'test/fixtures/error.scss';
  const {success, failed, error, disconnected, exitCode} = await run('Invalid scss file', fixture, {}, true);

  t.ifError(disconnected, 'Karma disconnected');
  t.true(error, 'Expected an error to be returned');
  t.is(exitCode, 1, 'Expected non zero exit code');
  t.is(success, 0, 'Expected no test successful');
  t.is(failed, 0, 'Expected no failed test');
});
