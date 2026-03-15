USE bistroflow_db;
ALTER TABLE users MODIFY id BIGINT NOT NULL;
-- Removing AUTO_INCREMENT by modifying the column definition.
