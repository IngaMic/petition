DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures (
     id SERIAL PRIMARY KEY,
     signature VARCHAR NOT NULL CHECK (signature != ''),
     userid INT NOT NULL REFERENCES users(id) UNIQUE
);