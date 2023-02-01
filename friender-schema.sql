CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  -- maybe email for verification
  hobbies TEXT,
  interests TEXT,
  image TEXT NOT NULL,
  -- // TODO: maybe change location to INT and name to zip?
  location INT NOT NULL,
  radius INT NOT NULL,
  join_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE matches (
  liker TEXT REFERENCES users
    ON DELETE CASCADE,
  likee TEXT REFERENCES users
    ON DELETE CASCADE,
  matched BOOLEAN);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL);
