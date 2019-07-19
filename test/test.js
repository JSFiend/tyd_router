
const assert = require('assert');
const TypRouter = require('../src');
const axios = require('axios/index');
const http = require('http');
const author = 'combinelee';
let typRouter = undefined;

describe('think you do 路由管理器', function () {
  it('实例化路由器', function () {
    typRouter = new TypRouter();
    assert( typeof typRouter.get === 'function', '路由管理器实例化后没有 get 办法')
  });

  describe('http 服务注入路由器，请求测试', function () {
    let server = undefined;
    beforeEach(function() {
      typRouter = new TypRouter();
      server = http.createServer().listen(3000);
      server.on('request', typRouter.inject);
    });
    it('get 测试', async function () {
      typRouter.get('/get', (req, res, next) => { req.author = author; next()}, (req, res, next) => { res.end(req.author) });
      let res = await axios.get('http://localhost:3000/get');
      assert( res.status === 200 && res.data === author, `res.data 不是 ${author}, 而是 ${res.data}`);
    });
    it('get 请求，获取 url 查询参数', async function() {
      typRouter.get('/get', (req, res, next) => { res.end(req.query.author) });
      let res = await axios.get('http://localhost:3000/get?author=combinelee');
      assert( res.status === 200 && res.data === author, `res.data 不是 ${author}, 而是 ${res.data}`);
    });
    it('post 测试', async function () {
      typRouter.post('/post', (req, res, next) => { res.method = req.method; next()}, (req, res, next) => { res.end(res.method) });
      let res = await axios.post('http://localhost:3000/post');
      assert( res.status === 200 && res.data.toLowerCase() === 'post', `res.data 不是 post, 而是 ${res.data}`);
    });
    it('post 请求， 获取请求体参数', async function () {
      typRouter.post('/post', (req, res, next) => { res.method = req.method; next()}, (req, res, next) => { res.end(res.method) });
      let res = await axios.post('http://localhost:3000/post');
      assert( res.status === 200 && res.data.toLowerCase() === 'post', `res.data 不是 post, 而是 ${res.data}`);
    });
    afterEach(function() {
      server.close();
    });
  })

});
