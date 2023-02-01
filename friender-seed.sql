INSERT INTO users (username, password, images, location, radius)
VALUES
  ('chalon', 'password123','{"image1.jpg", "image2.jpg"}', 94102, 50),
  ('arlaine', 'password456','{"image3.jpg", "image4.jpg"}', 94103, 25),
  ('nico', 'password789', '{"image5.jpg", "image6.jpg"}', 94104, 30),
  ('nikki', 'password789', '{"image5.jpg", "image6.jpg"}', 94104, 30),
  ('ken', 'password789', '{"image5.jpg", "image6.jpg"}', 94104, 30),
  ('brian', 'password789', '{"image5.jpg", "image6.jpg"}', 94104, 30),
  ('kadeem', 'password789', '{"image5.jpg", "image6.jpg"}', 94104, 30);

-- Something to think about, but no messages can be created unless there is a match between the two users. Something to check before we make messages later on
INSERT INTO matches (liker, likee, matched)
VALUES
  ('chalon', 'arlaine', true),
  ('arlaine', 'chalon', true),
  ('arlaine', 'ken', false),
  ('kadeem', 'nikki', true),
  ('nikki', 'brian', false),
  ('nikki', 'kadeem', true),
  ('nikki', 'arlaine', true),
  ('arlaine', 'nikki', true),
  ('chalon', 'brian', true),
  ('chalon', 'kadeem', true),
  ('nico', 'kadeem', true);


INSERT INTO messages (from_username, to_username, body)
VALUES
  ('chalon', 'arlaine', 'Hello! How are you?'),
  ('arlaine', 'chalon', 'Hi! What are you up to today?'),
  ('kadeem', 'nikki', 'Im your biggest fan!'),
  ('brian', 'chalon', 'You are my facorite person!'),
  ('nico', 'arlaine', 'Jeeze I wish I was as smart as you!');


