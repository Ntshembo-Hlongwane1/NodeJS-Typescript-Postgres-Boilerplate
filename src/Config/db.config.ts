import { Pool } from 'pg';
import { config } from 'dotenv';
config();

interface DbConfig {
  getPool(): Pool;
  init(): void;
}

export class dbConfig implements DbConfig {
  pool: Pool;

  getPool(): Pool {
    this.pool = new Pool({
      connectionString: process.env.DB,
    });
    return this.pool;
  }
  init(): void {
    let query = `
      CREATE TABLE IF NOT EXISTS Account(
        id SERIAL PRIMARY KEY,
        universityName VARCHAR(150),
        email VARCHAR(150) NOT NULL UNIQUE,
        address VARCHAR(200) NOT NULL,
        password VARCHAR(150) NOT NULL,
        verified Boolean NOT NULL,
        firstName VARCHAR(150),
        lastName VARCHAR(150),
        accountType VARCHAR(20)
      );
    `;

    let pool: Pool = new dbConfig().getPool();

    pool
      .query(query)
      .then(() => {
        console.log('Account table created');
        query = `
          CREATE TABLE IF NOT EXISTS GeneralQuestions(
            id SERIAL PRIMARY KEY,
            academicRecords JSON,
            extraCuricular JSON,
            family JSON,
            contact JSON,
            dob Date,
            gendar VARCHAR(1),
            country JSON,
            account_id INTEGER REFERENCES Account(id)
          );
        `;

        pool
          .query(query)
          .then(() => {
            console.log('General Questions Table created');

            query = `
              CREATE TABLE IF NOT EXISTS University(
                id SERIAL PRIMARY KEY,
                universityName VARCHAR(150) NOT NULL,
                addmissionCritea JSON,
                applicationRequirements JSON,
                applicationFee JSON,
                contact JSON,
                deadline JSON,
                courses JSON
              );
            `;

            pool
              .query(query)
              .then(() => {
                console.log('University Table Created');

                query = `
                  CREATE TABLE IF NOT EXISTS Application(
                    universityName VARCHAR(150) NOT NULL,
                    account_id INTEGER REFERENCES Account(id) NOT NULL,
                    addmissionCritea JSON,
                    applicationFee JSON,
                    applicationRequirements JSON,
                    gendar VARCHAR(1),
                    country JSON,
                    deadline JSON,
                    firstOption VARCHAR(150),
                    secondOption VARCHAR(150),
                    thirdOption VARCHAR(150)
                  );
                `;
                pool
                  .query(query)
                  .then(() => {
                    console.log('Application Table Created');
                  })
                  .catch(() => {
                    console.log('Failed to create Application Table');
                  });
              })
              .catch(() => {
                console.log('Failed to create University Table');
              });
          })
          .catch(() => {
            console.log('Failed to create General Question table');
          });
      })
      .catch(() => {
        console.log('Failed to create account table');
      });
  }
}
