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