import express, { Application } from 'express';
import cors from 'cors';
import { wrapper } from '../Middlewares/Wrapper';

export class ServerConfig {
  server: Application = express();

  constructor() {
    this.middleware();
    this.routes();
  }

  middleware(): void {
    this.server.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      })
    );
  }

  routes(): void {
    this.server.get('/test', (_request, response) => {
      response.status(200).json({ msg: 'Test' });
    });

    //Error Handler
    this.server.use(wrapper);
  }
}
