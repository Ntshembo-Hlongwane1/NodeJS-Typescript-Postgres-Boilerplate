import { Pool } from 'pg';
import { config } from 'dotenv';
config();

interface DbConfig {
  getPool(): Pool;
}

export class dbConfig implements DbConfig {
  pool: Pool;

  getPool() {
    this.pool = new Pool({
      connectionString: process.env.DB,
    });
    return this.pool;
  }
}
