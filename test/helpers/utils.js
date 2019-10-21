import pify from 'pify';
import pEvent from 'p-event';
import {render} from 'node-sass';

/**
 * Return a Promise that resolve when an event is emitted and reject after a timeout expire if the event is not emitted.
 *
 * @method waitFor
 * @param {Object} emitter object that emit events.
 * @param {string} event event to listen to.
 * @param {Number} [timeout=30000] maximum time to wait for the event to be emitted.
 * @return {Promise} Promise tht resolve when the event is emitted.
 */
export function waitFor(emitter, event, timeout = 30000) {
	return pEvent(emitter, event, {timeout});
}

/**
 * @typedef {Object} Compiled
 * @property {string} css the compiled css code.
 * @property {Object} map the sourcemap resulting from the compilation.
 */

/**
 * Compile a scss/sass file and return the result as a `string`.
 *
 * @method compile
 * @param {string} file path of the file to compile.
 * @param {Object} [options={}] node-sass options.
 * @return {Compiled} compiled code and source map.
 */
export async function compile(file, options = {}) {
	if (options.sourceMap || options.map) {
		options.sourceMap = true;
		options.sourceMapEmbed = true;
	}

	options.file = file;
	options.outFile = file;
	const {css, map} = await pify(render)(options);

	return {css: css.toString(), map: map ? JSON.parse(map) : undefined};
}
