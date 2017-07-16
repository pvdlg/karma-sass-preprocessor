# **karma-sass-preprocessor**

Karma preprocessor to compile sass and scss files with node-sass.

[![Travis](https://img.shields.io/travis/vanduynslagerp/karma-sass-preprocessor.svg)](https://travis-ci.org/vanduynslagerp/karma-sass-preprocessor)
[![AppVeyor](https://img.shields.io/appveyor/ci/vanduynslagerp/karma-sass-preprocessor.svg)](https://ci.appveyor.com/project/vanduynslagerp/karma-sass-preprocessor)
[![Code Climate](https://img.shields.io/codeclimate/github/vanduynslagerp/karma-sass-preprocessor.svg)](https://codeclimate.com/github/vanduynslagerp/karma-sass-preprocessor)
[![Code Climate](https://img.shields.io/codeclimate/issues/github/vanduynslagerp/karma-sass-preprocessor.svg)](https://codeclimate.com/github/vanduynslagerp/karma-sass-preprocessor/issues)
[![Codecov](https://img.shields.io/codecov/c/github/vanduynslagerp/karma-sass-preprocessor.svg)](https://codecov.io/gh/vanduynslagerp/karma-sass-preprocessor)

[![npm](https://img.shields.io/npm/v/@metahub/karma-sass-preprocessor.svg)](https://www.npmjs.com/package/@metahub/karma-sass-preprocessor)
[![npm](https://img.shields.io/npm/dt/@metahub/karma-sass-preprocessor.svg)](https://www.npmjs.com/package/@metahub/karma-sass-preprocessor)
[![Greenkeeper badge](https://badges.greenkeeper.io/vanduynslagerp/karma-sass-preprocessor.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/vanduynslagerp/karma-sass-preprocessor.svg)](https://github.com/vanduynslagerp/karma-sass-preprocessor/blob/master/LICENSE)

## Installation

```bash
npm install @metahub/karma-sass-preprocessor --save-dev
```

## Configuration

All the [node-sass](https://www.npmjs.com/package/node-sass) option can be passed to `sassPreprocessor`.

In addition the preprocessor accept a function in the optional `transformPath` configuration, to rewrite file path deployed on the Karma webserver. If not specified, the processed file will be accessible with the same path as the originals with the extension `.css` instead of `.sass` or `.scss`. For example `test/fixtures/myStyle.scss` will be deployed as `base/test/fixtures.myStyle.css`.

### Standard

```js
module.exports = function(config) {
  config.set({
    files: ['src/**/*.+(scss|sass)', 'test/fixtures/**/*.+(scss|sass)'],

    preprocessors: {
      'src/**/*.+(scss|sass)': ['sass'],
      'test/fixtures/**/*.+(scss|sass)': ['sass'],
    },

    sassPreprocessor: {
      options: {
        // To include inlined sourcemaps as data URIs
        sourceMap: true,
        // If compiled sass/scss files import external libraries
        includePaths: ['node_modules', 'path/to/imported/lib'],
        outputStyle: 'expanded',
      },
      // File test/fixtures/myStyle.sccs will be accessible in the unit test on path base/styles/myStyle.css
      transformPath: filePath => filePath.replace(/\.(sccs|sass)$/, '.css').replace(path.normalize('test/fixtures'), 'styles')
    },
  });
};
```

### Configured Preprocessors
See [configured preprocessors](http://karma-runner.github.io/1.0/config/preprocessors.html).

```js
module.exports = function(config) {
  config.set({
    files: ['src/**/*.+(scss|sass)', 'test/fixtures/**/*.+(scss|sass)'],

    preprocessors: {
      'src/**/*.+(scss|sass)': ['sass_1'],
      'test/fixtures/**/*.+(scss|sass)': ['sass_2'],
    },

    customPreprocessors: {
      sass_1: {
        base: 'sass',
        options: {
          sourceMap: true,
          precision: 5,
          outputStyle: 'expanded',
        },
      },
      sass_2: {
        base: 'sass',
        // File test/fixtures/myStyle.sccs will be accessible in the unit test on path base/compressed/myStyle.css
        transformPath: filePath => filePath.replace(/\.(sccs|sass)$/, '.css').replace(path.normalize('test/fixtures'), 'compressed')
        options: {
          sourceMap: false,
          precision: 8,
          outputStyle: 'compressed',
        },
      },
    },
  });
};
```
