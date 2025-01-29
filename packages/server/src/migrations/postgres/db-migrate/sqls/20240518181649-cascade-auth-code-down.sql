ALTER TABLE authorization_code
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id),

    DROP CONSTRAINT fk_user,
    ADD CONSTRAINT fk_user
     FOREIGN KEY (user_id) 
     REFERENCES users(id);
