import { Router } from 'express';
import { AuthController } from '../Controllers/Auth';
import { json } from 'body-parser';

const router = Router();
const Controller = new AuthController();

router.post('/api/signup', json(), (request, response, next) => {
  Controller.signup(request, response, next);
});

router.post('/api/signin', json(), (request, response, next) => {
  Controller.signin(request, response, next);
});

router.get('/api/signup/verify/:account', (request, response, next) => {
  Controller.activate(request, response, next);
});
export default router;
