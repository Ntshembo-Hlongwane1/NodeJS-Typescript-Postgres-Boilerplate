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