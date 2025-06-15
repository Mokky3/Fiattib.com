const request = require('supertest');
const app = require('../index');

describe('GET /', function () {
  it('responds with Fiattib backend is live!', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Fiattib backend is live!', done);
  });
});
