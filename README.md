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
      'src/**/*.+(scss|sass)': ['sassExpanded'],
      'test/fixtures/**/*.+(scss|sass)': ['sassCompressed'],
    },

    customPreprocessors: {
      sassExpanded: {
        base: 'sass',
        options: {
          sourceMap: true,
          precision: 5,
          outputStyle: 'expanded',
        },
      },
      sassCompressed: {
        base: 'sass',
        options: {
          options: {
            sourceMap: false,
            precision: 8,
            outputStyle: 'compressed',
          },
        },
      },
    },
  });
};
```
