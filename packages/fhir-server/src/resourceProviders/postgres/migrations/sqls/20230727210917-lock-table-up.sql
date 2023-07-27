create table locks (
   id SERIAL  NOT NULL PRIMARY KEY,
   workspace     UUID        NOT NULL,
   name TEXT  NOT NULL
);