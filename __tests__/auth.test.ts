import request from 'supertest';
import { ServerConfig } from '../src/Config/server.config';

const server = new ServerConfig().server;

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(''), 10000)); // avoid jest open handle error
});

describe('Auth ', () => {
  it('Account Creation /api/signup', () => {
    return request(server)
      .post('/api/signup')
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'Account type is required' });
      });
  });
});

describe('Auth -> Student', () => {
  it('Student Account creation /api/signup', () => {
    return request(server)
      .post('/api/signup')
      .send({
        email: 'jh0417783@gmail.com',
        password: '123456',
        address: 'Kremetart',
        accountType: 'Student',
        lastName: 'Hlongwane',
      })
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'All fields are required to create account' });
      });
  });
});

describe('Auth -> Student', () => {
  jest.setTimeout(30000);
  it('Student Account creation /api/signup', () => {
    return request(server)
      .post('/api/signup')
      .send({
        email: 'ntshembohlongwane1@gmail.com',
        password: '123456',
        address: 'Kremetart',
        accountType: 'Student',
        lastName: 'Hlongwane',
        firstName: 'Ntshembo',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ msg: `Account created, activation email sent to ntshembohlongwane1@gmail.com` });
      });
  });
});
