
const { METHODS } = require('http');

const URL = require('url');

const qs = require('querystring');

const Layer = require('./layer');

const { toString } = Object.prototype;

class TydRouter {
  constructor() {
    this.stack = [];
    this.inject = this.inject.bind(this);
  }

  // 作为中间件注入灵魂
  inject(req, res, callback) {
    const { stack } = this;
    let { url, method } = req;
    method = method.toLowerCase();
    let index = 0;
    function next(err) {
      if (toString.call(err) === '[object Error]' && typeof callback === 'function') return callback(err);
      let match;
      let layer;
      while (match !== true && index < stack.length) {
        layer = stack[index];
        index += 1;
        const { query, pathname } = URL.parse(url);
        match = layer.match(method, pathname);
        if (match) {
          req.query = qs.parse(query);
          try {
            layer.handler(req, res, next);
          } catch (e) {
            console.log('eeee', e);
            /* eslint no-unused-expressions:0 */
            typeof callback === 'function' && callback(e);
          }
        }
      }
      return true;
    }
    next();
  }
}

METHODS.concat('all').forEach((METHOD) => {
  const method = METHOD.toLowerCase();
  TydRouter.prototype[method] = function (path, ...fn) {
    fn.forEach((handler) => {
      const layer = new Layer(method, path, handler);
      this.stack.push(layer);
    });
  };
});

module.exports = TydRouter;
