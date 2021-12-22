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