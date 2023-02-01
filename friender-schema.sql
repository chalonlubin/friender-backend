CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  -- maybe email for verification
  hobbies TEXT,
  interest TEXT,
  -- Cannot get this data type to work, not sure the fix :(
  images TEXT[1] NOT NULL,
  -- // TODO: maybe change location to INT and name to zip?
  -- location TEXT NOT NULL,
  location INT NOT NULL,
  radius INT NOT NULL,
  join_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE matches (
  liker TEXT REFERENCES users,
  likee TEXT REFERENCES users,
  matched BOOLEAN);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL);

-- I was thinking about this, maybe this would be easier to use for the images?
-- The user could input form data, and then we lead them to a profile page where they can upload images of thesselves and work on their bio or something like that?
  -- CREATE TABLE images (
  -- id SERIAL PRIMARY KEY,
  -- username TEXT NOT NULL REFERENCES users,
  -- path TEXT NOT NULL);

