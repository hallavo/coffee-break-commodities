
\copy products from '/tmp/products.csv' delimiter ',' csv header;

INSERT INTO eventtypes VALUES
  ('login'),
  ('logout'),
  ('take'),
  ('restock');

INSERT INTO users (username, email, name, phone, salt, pwhash) VALUES
  ('senior-office-gnome', 'gnome@itcompany.com', 'Senior Office Gnome', '1234567890', ' ', ' '),
  ('junior-office-gnome', 'jrgnome@itcompany.com', 'Junior Office Gnome', '0987654321', ' ', ' ');


INSERT INTO events (username, eventtype, eventtime, amount, product) VALUES
  ('senior-office-gnome', 'take', '2022-05-01 12:00', '1', 'Kolmioleipä'),
  ('senior-office-gnome', 'take', '2022-05-01 12:01', '1', 'Kolmioleipä'),
  ('senior-office-gnome', 'take', '2022-05-01 12:02', '1', 'Kolmioleipä'),
  ('senior-office-gnome', 'take', '2022-05-01 12:03', '1', 'Kolmioleipä'),
  ('senior-office-gnome', 'take', '2022-05-01 12:04', '1', 'Hedelmä'),
  ('junior-office-gnome', 'take', '2022-05-01 12:04', '5', 'Hedelmä');
  
