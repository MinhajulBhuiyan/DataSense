CREATE DATABASE IF NOT EXISTS datasense;
USE datasense;

CREATE TABLE distributors (
  distributor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  registration_date DATE NOT NULL DEFAULT (CURDATE()),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  current_stock INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  distributor_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('placed','invoiced','cancelled') DEFAULT 'placed',
  total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
  notes TEXT,
  FOREIGN KEY (distributor_id) REFERENCES distributors(distributor_id)
);

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT CHECK (quantity > 0),
  price_per_unit DECIMAL(10,2) CHECK (price_per_unit > 0),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE invoices (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('invoiced','partial_delivered','fully_delivered','returned','cancelled') DEFAULT 'invoiced',
  total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
  delivered_amount DECIMAL(10,2) DEFAULT 0 CHECK (delivered_amount >= 0),
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE invoice_items (
  invoice_item_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity_invoiced INT CHECK (quantity_invoiced > 0),
  quantity_delivered INT DEFAULT 0 CHECK (quantity_delivered >= 0),
  price_per_unit DECIMAL(10,2) CHECK (price_per_unit > 0),
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE sales_returns (
  return_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT NOT NULL,
  total_returned_amount DECIMAL(10,2) CHECK (total_returned_amount > 0),
  status ENUM('pending','processed') DEFAULT 'pending',
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);

CREATE TABLE return_items (
  return_item_id INT AUTO_INCREMENT PRIMARY KEY,
  return_id INT NOT NULL,
  invoice_item_id INT NOT NULL,
  quantity_returned INT CHECK (quantity_returned > 0),
  FOREIGN KEY (return_id) REFERENCES sales_returns(return_id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_item_id) REFERENCES invoice_items(invoice_item_id)
);

CREATE TABLE cancellations (
  cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
  reference_id INT NOT NULL,
  reference_type ENUM('order','invoice'),
  cancellation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE vehicles (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(50) NOT NULL UNIQUE,
  capacity INT CHECK (capacity > 0),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE load_plans (
  load_plan_id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  plan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'planned',
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE load_plan_items (
  load_plan_item_id INT AUTO_INCREMENT PRIMARY KEY,
  load_plan_id INT NOT NULL,
  invoice_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'assigned',
  FOREIGN KEY (load_plan_id) REFERENCES load_plans(load_plan_id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);

CREATE TABLE challans (
  challan_id INT AUTO_INCREMENT PRIMARY KEY,
  load_plan_id INT NOT NULL,
  challan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSON,
  FOREIGN KEY (load_plan_id) REFERENCES load_plans(load_plan_id) ON DELETE CASCADE
);

CREATE TABLE gate_passes (
  gate_pass_id INT AUTO_INCREMENT PRIMARY KEY,
  load_plan_id INT NOT NULL,
  gate_pass_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSON,
  FOREIGN KEY (load_plan_id) REFERENCES load_plans(load_plan_id) ON DELETE CASCADE
);

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2) CHECK (amount > 0),
  method ENUM('cash','cheque','bank_deposit'),
  cheque_number VARCHAR(100),
  bank_deposit_ref VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);

CREATE TABLE refunds (
  refund_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2) CHECK (amount > 0),
  method ENUM('cash','cheque','bank_deposit','credit_note'),
  reason TEXT,
  status ENUM('pending','issued','processed') DEFAULT 'pending',
  reference_id INT,
  reference_type VARCHAR(50),
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);

CREATE TABLE inventory_transactions (
  tx_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  tx_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tx_type ENUM('production_add','sale_deduct','return_add','cancellation_add'),
  quantity INT CHECK (quantity != 0),
  reference_id INT,
  reference_type VARCHAR(50),
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

DELIMITER $$
CREATE TRIGGER trg_inventory_transactions_after_insert
AFTER INSERT ON inventory_transactions
FOR EACH ROW
BEGIN
  DECLARE delta INT;
  SET delta = CASE NEW.tx_type
                WHEN 'sale_deduct' THEN -ABS(NEW.quantity)
                WHEN 'production_add' THEN ABS(NEW.quantity)
                WHEN 'return_add' THEN ABS(NEW.quantity)
                WHEN 'cancellation_add' THEN ABS(NEW.quantity)
              END;
  UPDATE products SET current_stock = current_stock + delta WHERE product_id = NEW.product_id;
END$$
DELIMITER ;
