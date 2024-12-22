DELETE FROM authorization_code;

ALTER TABLE authorization_code
 ADD COLUMN scope user_scope NOT NULL default 'global',
 DROP COLUMN user_id,
 ADD COLUMN payload jsonb,
 ADD COLUMN user_id uuid NOT NULL,
 ADD CONSTRAINT fk_user
      FOREIGN KEY(user_id)
	  REFERENCES users(id);
