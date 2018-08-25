-- init db tables
use mydb;

-- Video table
CREATE TABLE video (
  id INTEGER AUTO_INCREMENT,
  game_id INTEGER,
  video_id VARCHAR(64),
  PRIMARY KEY (id)
);


INSERT INTO
    video (game_id, video_id)
VALUES
    (1, 'nFddOGmJ2-M'),
    (1, 'nFddOGmJ2-M'),
    (1, 'nFddOGmJ2-M');
