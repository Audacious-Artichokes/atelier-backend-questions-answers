DROP DATABASE IF EXISTS qna;

CREATE DATABASE qna;

DROP TABLE IF EXISTS answerPhotos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;


CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id INT,
  body VARCHAR(1000),
  date_written VARCHAR(255),
  asker_name VARCHAR(255),
  asker_email VARCHAR(255),
  reported BOOLEAN,
  helpful INT
);

COPY questions FROM '/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/questOutput.csv'
  DELIMITER '~' QUOTE '"' csv;

ALTER SEQUENCE questions_id_seq RESTART WITH 3518964;

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id INT,
  body VARCHAR(1000),
  date_written VARCHAR(255),
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported BOOLEAN,
  helpful INT,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

COPY answers FROM '/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answerOutput.csv'
  DELIMITER '~' QUOTE '"' csv;

  ALTER SEQUENCE answers_id_seq RESTART WITH 6879307;

CREATE TABLE answerPhotos (
  id serial PRIMARY KEY,
  answer_id INT,
  url TEXT,
  FOREIGN KEY (answer_id) REFERENCES answers(id)
);

COPY answerPhotos FROM '/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answerPhotoOutput.csv'
  DELIMITER '~' QUOTE '"' csv;

  ALTER SEQUENCE answerphotos_id_seq RESTART WITH 2063760;

CREATE INDEX idx_product_id ON questions(product_id);

CREATE INDEX idx_answer_id ON answerphotos(answer_id);

CREATE INDEX idx_question_id ON answers(question_id);