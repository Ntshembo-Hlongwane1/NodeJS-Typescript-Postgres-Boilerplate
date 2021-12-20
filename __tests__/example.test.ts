import request from 'supertest';
import { ServerConfig } from '../src/Config/server.config';

const server = new ServerConfig().server;

describe('Test Example', () => {
  it('Test /test', () => {
    return request(server)
      .get('/test')
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
});
