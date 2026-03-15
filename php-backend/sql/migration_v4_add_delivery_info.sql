-- Add delivery support and customer details to orders table
ALTER TABLE orders 
MODIFY COLUMN order_type ENUM('dine-in', 'takeout', 'delivery') NOT NULL;

ALTER TABLE orders
ADD COLUMN customer_name VARCHAR(255) NULL,
ADD COLUMN customer_email VARCHAR(255) NULL,
ADD COLUMN customer_phone VARCHAR(50) NULL,
ADD COLUMN shipping_address TEXT NULL,
ADD COLUMN delivery_fee DECIMAL(10,2) DEFAULT 0.00;
