\echo 'Delete and recreate friender db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE friender;
CREATE DATABASE friender;
\connect friender


CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  hobbies TEXT,
  interests TEXT,
  images TEXT[] NOT NULL,
  location INT NOT NULL,
  radius INT NOT NULL,
  join_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE matches (
  liker TEXT REFERENCES users
    ON DELETE CASCADE,
  likee TEXT REFERENCES users
    ON DELETE CASCADE,
  matched BOOLEAN);

\echo 'Delete and recreate friender db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE friender_test;
CREATE DATABASE friender_test;
\connect friender_test

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  hobbies TEXT,
  interests TEXT,
  location INT NOT NULL,
  radius INT NOT NULL,
  join_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE matches (
  liker TEXT REFERENCES users
    ON DELETE CASCADE,
  likee TEXT REFERENCES users
    ON DELETE CASCADE,
  matched BOOLEAN);
