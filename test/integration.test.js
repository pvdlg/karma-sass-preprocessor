import path from 'path';
import {copy} from 'fs-extra';
import test from 'ava';
import {stub} from 'sinon';
import tempy from 'tempy';
import {run, watch, waitForRunComplete} from './helpers/karma';

let stubWrite;

test.before(() => {
	stubWrite = stub(process.stdout, 'write');
});

test.after(() => {
	stubWrite.restore();
});

test.serial('Compile scss file', async t => {
	const {success, error, disconnected, errMsg} = await run([
		'test/fixtures/basic.scss',
		'test/fixtures/styles.test.js',
	]);

	t.falsy(error, `Karma returned the error: ${errMsg}`);
	t.falsy(disconnected, 'Karma disconnected');
	t.is(success, 1, 'Expected 1 test successful');
});

test.serial('Compile scss file with custom preprocessor', async t => {
	const {success, error, disconnected, errMsg} = await run([
		'test/fixtures/basic.custom.scss',
		'test/fixtures/styles.test.js',
	]);

	t.falsy(error, `Karma returned the error: ${errMsg}`);
	t.falsy(disconnected, 'Karma disconnected');
	t.is(success, 1, 'Expected 1 test successful');
});

test.serial('Log error on invalid scss file', async t => {
	const {error, disconnected, exitCode} = await run('test/fixtures/error.scss');

	t.falsy(disconnected, 'Karma disconnected');
	t.true(error, 'Expected an error to be returned');
	t.is(exitCode, 1, 'Expected non zero exit code');
});

test.serial('Re-compile scss file when dependency is modified', async t => {
	const dir = tempy.directory();
	const fixture = path.join(dir, 'with-partial.scss');
	const includePath = path.join(dir, 'partials');
	const partial = path.join(includePath, '_partial.scss');
	const subPartial = path.join(includePath, '_sub-partial.scss');

	await Promise.all([
		copy('test/fixtures/partials/_partial.scss', partial),
		copy('test/fixtures/partials/_sub-partial.scss', subPartial),
		copy('test/fixtures/with-partial.scss', fixture),
	]);
	const {server, watcher} = await watch(
		[fixture.replace('fixtures', '*').replace('with', '+(with|nomatch)'), 'test/fixtures/styles.test.js'],
		{options: {includePaths: [includePath]}}
	);

	try {
		let {success, error, disconnected, errMsg} = await waitForRunComplete(server);

		t.falsy(error, `Karma returned the error: ${errMsg}`);
		t.falsy(disconnected, 'Karma disconnected');
		t.is(success, 1, 'Expected 1 test successful');

		watcher.emit('change', partial);
		({success, error, disconnected, errMsg} = await waitForRunComplete(server));

		t.falsy(error, `Karma returned the error: ${errMsg}`);
		t.falsy(disconnected, 'Karma disconnected');
		t.is(success, 1, 'Expected 1 test successful');
	} finally {
		await server.emitAsync('exit');
	}
});
