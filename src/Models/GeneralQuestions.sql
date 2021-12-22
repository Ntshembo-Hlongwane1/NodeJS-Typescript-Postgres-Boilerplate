CREATE TABLE IF NOT EXISTS GeneralQuestions(
  id SERIAL PRIMARY KEY,
  academicRecords JSON,
  extraCuricular JSON,
  family JSON,
  contact JSON,
  dob Date,
  gendar VARCHAR(1),
  country JSON,
  account_id INTEGER REFERENCES Account(id),
);