import path from 'path';
import sass from 'node-sass';
import {merge, clone} from 'lodash';

/**
 * Sass preprocessor factory.
 * 
 * @param {Object} args Config object of custom preprocessor.
 * @param {Object} [config={}] Config object of sassPreprocessor.
 * @param {Object} logger Karma's logger.
 * @return {Function} the function to preprocess files.
 */
function createSassPreprocessor(args, config = {}, logger) {
  const log = logger.create('preprocessor.sass');
  const options = merge({sourceMap: false}, args.options || {}, config.options || {});
  const transformPath =
    args.transformPath ||
    config.transformPath ||
    (filepath => `${path.dirname(filepath)}/${path.basename(filepath, path.extname(filepath))}.css`);

  return (content, file, done) => {
    log.debug('Processing "%s".', file.originalPath);
    file.path = transformPath(file.originalPath);

    // Clone the options because we need to mutate them
    const opts = clone(options);

    // Add current file's directory into include paths
    opts.includePaths = [path.dirname(file.originalPath)].concat(opts.includePaths || []);
    // Inline source maps
    if (opts.sourceMap || opts.map) {
      opts.sourceMap = true;
      opts.sourceMapEmbed = true;
    }

    opts.indentedSyntax = file.originalPath.indexOf('.sass') !== -1;
    opts.data = content.toString();

    sass.render(opts, (err, result) => {
      if (err) {
        log.error('%s\n  at %s:%d', err.message, file.originalPath, err.line);
        return done(err, null);
      }
      return done(null, result.css);
    });
  };
}

// Inject dependencies
createSassPreprocessor.$inject = ['args', 'config.sassPreprocessor', 'logger'];

// Export preprocessor
module.exports = {
  'preprocessor:sass': ['factory', createSassPreprocessor],
};
