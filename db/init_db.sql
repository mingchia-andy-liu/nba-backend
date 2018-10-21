-- init db tables
use mydb;

-- Video table
CREATE TABLE video (
  id INTEGER AUTO_INCREMENT,
  game_id VARCHAR(64),
  video_id VARCHAR(64),
  PRIMARY KEY (id)
);

-- Date table
CREATE TABLE `date` (
  date DATE NOT NULL PRIMARY KEY,
  is_complete BIT(1) NOT NULL DEFAULT 0
);

CREATE TABLE ints ( i tinyint );
INSERT INTO ints VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);

INSERT INTO `date` (date)
  SELECT DATE('2018-10-16') + INTERVAL a.i*100 + b.i*10 + c.i DAY
  FROM ints a JOIN ints b JOIN ints c
    -- create a year of table
    WHERE (a.i*100 + b.i*10 + c.i) < 365
ORDER BY 1;

DROP TABLE ints;
