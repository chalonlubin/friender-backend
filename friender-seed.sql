INSERT INTO users (username, password, image, location, radius)
VALUES
  ('chalon', 'password123','image1.jpg', 94102, 50),
  ('arlaine', 'password456','image3.jpg', 94103, 25),
  ('nico', 'password789', 'image5.jpg', 99502, 30),
  ('nicki', 'password109', 'image5.jpg', 97701, 30),
  ('ken', 'password119', 'image5.jpg', 99504, 30),
  ('brian', 'password129', 'image5.jpg', 12345, 30),
  ('kadeem', 'password139', 'image5.jpg', 10235, 30);

-- Something to think about, but no messages can be created unless there is a match between the two users. Something to check before we make messages later on
INSERT INTO matches (liker, likee, matched)
VALUES
  ('chalon', 'arlaine', true),
  ('chalon', 'brian', true),
  ('chalon', 'kadeem', true),
  ('arlaine', 'chalon', true),
  ('arlaine', 'ken', false),
  ('arlaine', 'nicki', true),
  ('kadeem', 'nicki', true),
  ('kadeem', 'ken', true),
  ('nicki', 'kadeem', true),
  ('nicki', 'brian', false),
  ('nicki', 'arlaine', true),
  ('nico', 'kadeem', false),
  ('nico', 'brian', false),
  ('nico', 'chalon', false),
  ('brian', 'chalon', true),
  ('ken', 'kadeem', true);

  -- for tracking sake MATCHES: chalon/arlaine, chalon/brian, arlaine/nicki, kadeem/nicki, ken/kadeem
  -- The rest are not matched


INSERT INTO messages (from_username, to_username, body)
VALUES
  ('chalon', 'arlaine', 'Hello! How are you?'),
  ('arlaine', 'chalon', 'Hi! What are you up to today?'),
  ('kadeem', 'nicki', 'Im your biggest fan!'),
  ('brian', 'chalon', 'You are my facorite person!'),
  ('nicki', 'arlaine', 'YOO IM nicki MINAJ!');
