-- init db tables
use mydb;

-- Video table
CREATE TABLE video (
  id INTEGER AUTO_INCREMENT,
  game_id VARCHAR(64),
  video_id VARCHAR(64),
  PRIMARY KEY (id)
);


INSERT INTO
    video (game_id, video_id)
VALUES
    ('0021700000', 'nFddOGmJ2-M'),
    ('0021700001', 'nFddOGmJ2-M'),
    ('0021700002', 'nFddOGmJ2-M'),
