CREATE TABLE products (
  name varchar PRIMARY KEY,
  price decimal NOT NULL,
  active boolean NOT NULL,
  dateadded date NOT NULL
);

CREATE TABLE users (
	userid serial PRIMARY KEY,
  username varchar UNIQUE NOT NULL,
  email varchar,
  name varchar,
  phone varchar,
  salt varchar NOT NULL,
  pwhash varchar NOT NULL
);

CREATE TABLE eventtypes (
  eventtype varchar PRIMARY KEY
);

CREATE TABLE events (
  eventid serial PRIMARY KEY,
  username varchar references users(username),
  eventtype varchar references eventtypes(eventtype),
  eventtime timestamp,
  amount int,
  product varchar references products(name)
);
