INSERT INTO users (username, password, images, location, radius)
VALUES
  ('chalon', 'password123','{"image1.jpg", "image2.jpg"}', 94102, 50),
  ('arlaine', 'password456','{"image3.jpg", "image4.jpg"}', 94103, 25),
  ('nico', 'password789', '{"image5.jpg", "image6.jpg"}', 99502, 30),
  ('nikki', 'password109', '{"image5.jpg", "image6.jpg"}', 97701, 30),
  ('ken', 'password119', '{"image5.jpg", "image6.jpg"}', 99504, 30),
  ('brian', 'password129', '{"image5.jpg", "image6.jpg"}', 12345, 30),
  ('kadeem', 'password139', '{"image5.jpg", "image6.jpg"}', 10235, 30);

-- Something to think about, but no messages can be created unless there is a match between the two users. Something to check before we make messages later on
INSERT INTO matches (liker, likee, matched)
VALUES
  ('chalon', 'arlaine', true),
  ('chalon', 'brian', true),
  ('chalon', 'kadeem', true),
  ('arlaine', 'chalon', true),
  ('arlaine', 'ken', false),
  ('arlaine', 'nikki', true),
  ('kadeem', 'nikki', true),
  ('kadeem', 'ken', true),
  ('nikki', 'kadeem', true),
  ('nikki', 'brian', false),
  ('nikki', 'arlaine', true),
  ('nico', 'kadeem', false),
  ('nico', 'brian', false),
  ('nico', 'chalon', false),
  ('brian', 'chalon', true),
  ('ken', 'kadeem', true);

  -- for tracking sake MATCHES: chalon/arlaine, chalon/brian, arlaine/nikki, kadeem/nikki, ken/kadeem
  -- The rest are not matched


INSERT INTO messages (from_username, to_username, body)
VALUES
  ('chalon', 'arlaine', 'Hello! How are you?'),
  ('arlaine', 'chalon', 'Hi! What are you up to today?'),
  ('kadeem', 'nikki', 'Im your biggest fan!'),
  ('brian', 'chalon', 'You are my facorite person!'),
  ('nikki', 'arlaine', 'YOO IM NIKKI MINAJ!');


