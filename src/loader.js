import Svgo from 'svgo';
import {transform as babelTransform} from 'babel-core';
import loaderUtils from 'loader-utils';

import {validateAndFix} from './svgo';
import plugin from './plugin';

function optimize (opts) {
  opts = Object.assign({
    plugins: [
      { removeStyleElement: true }
    ]
  }, opts)
  validateAndFix(opts);
  const svgo = new Svgo(opts);
  return function (content) {
    return new Promise((resolve, reject) =>
      svgo.optimize(content, ({error, data}) => error ? reject(error) : resolve(data))
    );
  };
}

function transform (opts) {
  return function(content) {
    const babelOpts = {
      babelrc: false,
      presets: ['react', 'env'],
      plugins: [plugin, 'transform-object-rest-spread']
    };
    return babelTransform(content, babelOpts);
  }
}

export default function (content) {
  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  const query = loaderUtils.getOptions(this) || {};

  let cb = this.async();

  Promise.resolve(String(content))
    .then(optimize(query.svgo))
    .then(transform({
      jsx: query.jsx
    }))
    .then(result => {
      cb(null, result.code);
    })
    .catch(err => {
      cb(err);
    });
}
