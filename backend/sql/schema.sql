DROP TABLE IF EXISTS creds CASCADE;
CREATE TABLE creds (
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
  data jsonb
);
DROP TABLE IF EXISTS post CASCADE;
CREATE TABLE post (
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
  author UUID REFERENCES creds(id),
  data jsonb
);

-- Doing CASCADE on a foreign key deletes the key? 
DROP TABLE IF EXISTS socialgroup CASCADE;
CREATE TABLE socialgroup (
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  owner UUID REFERENCES creds(id),
  data jsonb
);

DROP TABLE IF EXISTS memberingroup CASCADE;
CREATE TABLE memberingroup (
  member UUID REFERENCES creds(id),
  socialgroup UUID REFERENCES socialgroup(id)
);
