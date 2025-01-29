ALTER TABLE users ADD COLUMN root_user  UUID;
ALTER TABLE users ADD CONSTRAINT fk_root_user
      FOREIGN KEY(root_user)
	  REFERENCES users(id);