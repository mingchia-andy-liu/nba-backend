-- init db tables
use mydb;

-- Video table
CREATE TABLE video (
  id INTEGER AUTO_INCREMENT,
  game_id VARCHAR(64),
  video_id VARCHAR(64),
  PRIMARY KEY (id)
);
