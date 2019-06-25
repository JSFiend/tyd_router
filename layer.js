
class Layer {
  constructor(method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
  }

  match(method, path) {
    return this.path === path && (this.method === 'all' || this.method === method);
  }
}

module.exports = Layer;
