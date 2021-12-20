import { Router } from 'express';
import { Auth } from '../Controllers/Auth';
import { json } from 'body-parser';

const router = Router();
const Controller = new Auth();

router.post('/api/signup', json(), (request, response, next) => {
  Controller.signup(request, response, next);
});

export default router;
