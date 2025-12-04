-- Your data insert statements go here;
DELETE FROM memberingroup;  -- Delete this FIRST (references socialgroup and creds)
DELETE FROM post;           -- Delete this SECOND (references creds)
DELETE FROM socialgroup;    -- Delete this THIRD (references creds)
DELETE FROM creds;          -- Delete this LAST (parent table)

-- Data with the help of claude AI
-- diraheta arealpassword
-- molly mollymember
-- anna annaadmin
-- professor letsfailgio
-- mshmitt waitimgoated
-- sam waitimdelusional
INSERT INTO creds (id, data) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"username":"diraheta@ucsc.edu", "password":"$2a$12$gwiiEhJownX5acn6OzNITegy1mS5bUgrcFHNuFhyO3E0zA.gH5TtS", "name":"dilbert"}'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '{"username":"molly@books.com", "password":"$2a$12$Q1j5BpzrZJyX9r4H6UM97Ot5uO99IBep1pBEuh/CToDgtZe3HkfMi", "name":"molly"}'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '{"username":"anna@books.com", "password":"$2a$12$G0XYSc6oqPoQT/kgto64kettDT1CanBEa4bmtoB9Tf60RHTREzGKa", "name":"anna"}'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '{"username":"professor@ucsc.edu", "password":"$2a$12$yF9aLsyiFZ3aQGm1l5MDFufBSa.z02z6IZvH4WeX3G5iPN6VXP5X6", "name":"professor"}'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '{"username":"mshmitt@ucsc.edu", "password":"$2a$12$X39cqAc8AcsFNUBCW6ppEOvCIsOI3.EP8o79lJl7KFZtYIM4wzJpu", "name":"micah"}'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '{"username":"sam@snapchat.com", "password":"$2a$12$tlm.cBN3F.pxLq0t9zyiFObUExVso4OReiomAIHhzPGF5eM5ui3Ha", "name":"sam"}');

INSERT INTO socialgroup (id, owner, data) VALUES 
  ('10000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"name":"People I like"}'),
  ('20000000-0000-0000-0000-000000000002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '{"name":"CSE186"}');

INSERT INTO post (author, data) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIB6ys-cWBryrjVnEfYf186eNMAximvWgtxQ&s","created":"2025-11-30T21:42:30.526Z", "text":"grah", "socialgroup":null, "likes":[]}'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '{"img":"https://www.rap-up.com/article/media_1fbb4297d00311931c2f90bc5fe65e80883ea13db.png?width=800&format=png&optimize=high", "created":"2025-11-27T21:42:30.000Z", "text":"hey freakbob here", "socialgroup":null, "likes":[]}'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '{"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSurlBct6TRfGQDnkt3SHufWvVfdN6MEmOc2A", "created": "2025-01-08T21:42:30.000Z", "text":"wait im healing", "socialgroup":null, "likes":[]}'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"img":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1200px-The_Garden_of_earthly_delights.jpg", "text":"But do i like you?", "created":"2025-11-28T15:30:00.000Z", "socialgroup":"10000000-0000-0000-0000-000000000001", "likes":[]}'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '{"img":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.svg/250px-Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.svg.png", "text":"Time to learn kids", "created":"2025-11-29T10:15:00.000Z", "socialgroup":"20000000-0000-0000-0000-000000000002", "likes":[]}');

INSERT INTO memberingroup (member, socialgroup) VALUES 
  -- mshmitt in "People I like"
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '10000000-0000-0000-0000-000000000001'),
  -- diraheta, molly, and anna in "CSE186"
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '20000000-0000-0000-0000-000000000002'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '20000000-0000-0000-0000-000000000002'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '20000000-0000-0000-0000-000000000002');