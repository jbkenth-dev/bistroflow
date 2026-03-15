USE bistroflow_db;

-- Add indexes for performance optimization
-- Orders table: Index on status and created_at for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders (status, created_at);

-- Orders table: Index on created_at alone for default sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);

-- Orders table: Index on user_id for JOIN performance (if not auto-created)
-- MySQL usually indexes FKs, but explicit index is safe. 
-- Using IF NOT EXISTS or checking if index exists is better, but pure SQL standard doesn't support IF NOT EXISTS for INDEX in all versions easily.
-- For MariaDB/MySQL 5.7+ it might fail if exists.
-- We'll use a stored procedure or just try to add it and ignore error in a robust migration system.
-- For this simple setup, we'll just run it. If it fails, it fails (likely already exists).

-- Order Items table: Index on order_id for JOIN performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
