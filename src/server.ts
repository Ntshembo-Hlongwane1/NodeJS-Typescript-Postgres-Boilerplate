import { config } from 'dotenv';
import { ServerConfig } from './Config/server.config';
import { Application } from 'express';
config();

export class API {
  PORT: string | number = process.env.PORT ?? 5000;
  serverConfig: ServerConfig;
  server: Application;

  constructor() {
    this.serverConfig = new ServerConfig();
    this.server = this.serverConfig.server;
    this.init();
  }

  init(): void {
    this.server.listen(this.PORT, () => {
      return console.log(`Server started in PORT ${this.PORT}`);
    });
  }
}

new API();
