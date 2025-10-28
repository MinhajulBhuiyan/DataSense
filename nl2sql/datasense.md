# Datasense Database Schema and Example Data

This document provides a detailed description of the `datasense` database schema, designed for an ice cream manufacturing company's operations. It focuses on sales to registered distributors, including entities for distributors, products, orders, invoices, deliveries, returns, cancellations, payments, refunds, inventory transactions, vehicles, load plans, and documents like challans and gate passes. The schema is MySQL-compatible, with auto-incrementing keys, foreign keys, ENUMs, CHECK constraints, indexes, and triggers.

The schema promotes immutability and auditability: original records (e.g., invoices) are not mutated; adjustments like returns or refunds are handled in separate tables. This is ideal for AI-based reporting and training LLMs like Llama 3 for tasks such as SQL query generation or data analysis.

For LLM training, use this document as a knowledge base. Example prompts: "Based on the datasense schema, write a SQL query to calculate net revenue for a distributor." Pair with example data for fine-tuning.

## Database Overview
- **Name**: datasense
- **Key Features**:
  - Normalized to 3NF to reduce redundancy.
  - Stock updates via triggers on inventory transactions.
  - Financial adjustments (refunds) tied to payments, returns, and cancellations.
  - Delivery planning with vehicles and auto-generated documents.
- **Assumptions**:
  - One order per invoice.
  - Stock deducted on invoicing, added back on returns/cancellations.
  - App logic enforces rules (e.g., can't return more than delivered).
- **Creation Script Snippet** (for reference; full script not included here):
  ```sql
  CREATE DATABASE IF NOT EXISTS datasense;
  USE datasense;
  -- Table definitions follow...
  ```

## Table Descriptions

### 1. distributors
- **Purpose**: Stores registered distributors.
- **Columns**:
  - `distributor_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `name`: VARCHAR(255) NOT NULL
  - `address`: TEXT NOT NULL
  - `contact_phone`: VARCHAR(50)
  - `contact_email`: VARCHAR(255)
  - `registration_date`: DATE NOT NULL DEFAULT (CURDATE())
  - `is_active`: BOOLEAN DEFAULT TRUE
- **Relationships**: Referenced by orders.
- **Example Data**:
  ```sql
  INSERT INTO distributors (name, address, registration_date) VALUES ('DistribCo North', '123 North St', '2024-01-01');
  -- ID: 1
  ```

### 2. products
- **Purpose**: Ice cream products with stock tracking.
- **Columns**:
  - `product_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `name`: VARCHAR(255) NOT NULL UNIQUE
  - `description`: TEXT
  - `unit_price`: DECIMAL(10,2) NOT NULL CHECK (unit_price > 0)
  - `current_stock`: INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0)
  - `is_active`: BOOLEAN DEFAULT TRUE
- **Relationships**: Referenced by order_items, invoice_items, inventory_transactions.
- **Example Data**:
  ```sql
  INSERT INTO products (name, unit_price) VALUES ('Vanilla Delight', 5.00);
  -- ID: 1, current_stock: 0 (updated via transactions)
  ```

### 3. orders
- **Purpose**: Sales orders for distributors.
- **Columns**:
  - `order_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `distributor_id`: INT NOT NULL (FK to distributors)
  - `order_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `status`: ENUM('placed', 'invoiced', 'cancelled') DEFAULT 'placed'
  - `total_amount`: DECIMAL(10,2) CHECK (total_amount >= 0)
  - `notes`: TEXT
- **Relationships**: FK to distributors; Referenced by invoices, order_items.
- **Example Data**:
  ```sql
  INSERT INTO orders (distributor_id, total_amount, status) VALUES (1, 1500.00, 'invoiced');
  -- ID: 1
  ```

### 4. order_items
- **Purpose**: Order line items.
- **Columns**:
  - `order_item_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `order_id`: INT NOT NULL (FK)
  - `product_id`: INT NOT NULL (FK)
  - `quantity`: INT CHECK (quantity > 0)
  - `price_per_unit`: DECIMAL(10,2) CHECK (price_per_unit > 0)
- **Relationships**: FK to orders (CASCADE), products.
- **Example Data**:
  ```sql
  INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES (1, 1, 200, 5.00);
  -- ID: 1
  ```

### 5. invoices
- **Purpose**: Invoices from orders, triggering delivery and stock hits.
- **Columns**:
  - `invoice_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `order_id`: INT NOT NULL (FK)
  - `invoice_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `status`: ENUM('invoiced', 'partial_delivered', 'fully_delivered', 'returned', 'cancelled') DEFAULT 'invoiced'
  - `total_amount`: DECIMAL(10,2) CHECK (total_amount >= 0)
  - `delivered_amount`: DECIMAL(10,2) DEFAULT 0 CHECK (delivered_amount >= 0)
  - `notes`: TEXT
- **Relationships**: FK to orders; Referenced by invoice_items, load_plan_items, payments, refunds, sales_returns.
- **Example Data**:
  ```sql
  INSERT INTO invoices (order_id, total_amount, status) VALUES (1, 1500.00, 'fully_delivered');
  -- ID: 1
  ```

### 6. invoice_items
- **Purpose**: Invoice line items.
- **Columns**:
  - `invoice_item_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `invoice_id`: INT NOT NULL (FK)
  - `product_id`: INT NOT NULL (FK)
  - `quantity_invoiced`: INT CHECK (quantity_invoiced > 0)
  - `quantity_delivered`: INT DEFAULT 0 CHECK (quantity_delivered >= 0)
  - `price_per_unit`: DECIMAL(10,2) CHECK (price_per_unit > 0)
- **Relationships**: FK to invoices (CASCADE), products; Referenced by return_items.
- **Example Data**:
  ```sql
  INSERT INTO invoice_items (invoice_id, product_id, quantity_invoiced, quantity_delivered, price_per_unit) VALUES (1, 1, 200, 200, 5.00);
  -- ID: 1
  ```

### 7. sales_returns
- **Purpose**: Separate tracking for returns.
- **Columns**:
  - `return_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `invoice_id`: INT NOT NULL (FK)
  - `return_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `reason`: TEXT NOT NULL
  - `total_returned_amount`: DECIMAL(10,2) CHECK (total_returned_amount > 0)
  - `status`: ENUM('pending', 'processed') DEFAULT 'pending'
  - `notes`: TEXT
- **Relationships**: FK to invoices; Referenced by return_items.
- **Example Data**:
  ```sql
  INSERT INTO sales_returns (invoice_id, reason, total_returned_amount, status) VALUES (1, 'Damaged', 100.00, 'processed');
  -- ID: 1
  ```

### 8. return_items
- **Purpose**: Granular return details.
- **Columns**:
  - `return_item_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `return_id`: INT NOT NULL (FK)
  - `invoice_item_id`: INT NOT NULL (FK)
  - `quantity_returned`: INT CHECK (quantity_returned > 0)
- **Relationships**: FK to sales_returns (CASCADE), invoice_items.
- **Example Data**:
  ```sql
  INSERT INTO return_items (return_id, invoice_item_id, quantity_returned) VALUES (1, 1, 20);
  -- ID: 1
  ```

### 9. cancellations
- **Purpose**: Cancellations for orders/invoices.
- **Columns**:
  - `cancellation_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `reference_id`: INT NOT NULL
  - `reference_type`: ENUM('order', 'invoice')
  - `cancellation_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `reason`: TEXT NOT NULL
  - `notes`: TEXT
- **Relationships**: Loose reference via reference_id.
- **Example Data**:
  ```sql
  INSERT INTO cancellations (reference_id, reference_type, reason) VALUES (1, 'order', 'Cancelled by client');
  -- ID: 1
  ```

### 10. vehicles
- **Purpose**: Delivery vehicles.
- **Columns**:
  - `vehicle_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `plate_number`: VARCHAR(50) NOT NULL UNIQUE
  - `capacity`: INT CHECK (capacity > 0)
  - `description`: TEXT
  - `is_active`: BOOLEAN DEFAULT TRUE
- **Relationships**: Referenced by load_plans.
- **Example Data**:
  ```sql
  INSERT INTO vehicles (plate_number, capacity) VALUES ('VAN-001', 5000);
  -- ID: 1
  ```

### 11. load_plans
- **Purpose**: Delivery load plans.
- **Columns**:
  - `load_plan_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `vehicle_id`: INT NOT NULL (FK)
  - `plan_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `status`: VARCHAR(50) DEFAULT 'planned'
- **Relationships**: FK to vehicles; Referenced by load_plan_items, challans, gate_passes.
- **Example Data**:
  ```sql
  INSERT INTO load_plans (vehicle_id, status) VALUES (1, 'completed');
  -- ID: 1
  ```

### 12. load_plan_items
- **Purpose**: Invoices in load plans.
- **Columns**:
  - `load_plan_item_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `load_plan_id`: INT NOT NULL (FK)
  - `invoice_id`: INT NOT NULL (FK)
  - `status`: VARCHAR(50) DEFAULT 'assigned'
- **Relationships**: FK to load_plans (CASCADE), invoices.
- **Example Data**:
  ```sql
  INSERT INTO load_plan_items (load_plan_id, invoice_id, status) VALUES (1, 1, 'delivered');
  -- ID: 1
  ```

### 13. challans
- **Purpose**: Delivery challans.
- **Columns**:
  - `challan_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `load_plan_id`: INT NOT NULL (FK)
  - `challan_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `details`: JSON
- **Relationships**: FK to load_plans (CASCADE).
- **Example Data**:
  ```sql
  INSERT INTO challans (load_plan_id, details) VALUES (1, '{"items": ["Invoice 1"]}');
  -- ID: 1
  ```

### 14. gate_passes
- **Purpose**: Gate passes for loads.
- **Columns**:
  - `gate_pass_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `load_plan_id`: INT NOT NULL (FK)
  - `gate_pass_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `details`: JSON
- **Relationships**: FK to load_plans (CASCADE).
- **Example Data**:
  ```sql
  INSERT INTO gate_passes (load_plan_id, details) VALUES (1, '{"driver": "John"}');
  -- ID: 1
  ```

### 15. payments
- **Purpose**: Distributor payments.
- **Columns**:
  - `payment_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `invoice_id`: INT NOT NULL (FK)
  - `payment_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `amount`: DECIMAL(10,2) CHECK (amount > 0)
  - `method`: ENUM('cash', 'cheque', 'bank_deposit')
  - `cheque_number`: VARCHAR(100)
  - `bank_deposit_ref`: VARCHAR(100)
  - `notes`: TEXT
- **Relationships**: FK to invoices.
- **Example Data**:
  ```sql
  INSERT INTO payments (invoice_id, amount, method) VALUES (1, 1500.00, 'cash');
  -- ID: 1
  ```

### 16. refunds
- **Purpose**: Refunds for adjustments.
- **Columns**:
  - `refund_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `invoice_id`: INT NOT NULL (FK)
  - `refund_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `amount`: DECIMAL(10,2) CHECK (amount > 0)
  - `method`: ENUM('cash', 'cheque', 'bank_deposit', 'credit_note')
  - `reason`: TEXT
  - `status`: ENUM('pending', 'issued', 'processed') DEFAULT 'pending'
  - `reference_id`: INT
  - `reference_type`: VARCHAR(50)
  - `notes`: TEXT
- **Relationships**: FK to invoices.
- **Example Data**:
  ```sql
  INSERT INTO refunds (invoice_id, amount, method, reason) VALUES (1, 100.00, 'cash', 'Overpayment');
  -- ID: 1
  ```

### 17. inventory_transactions
- **Purpose**: Stock audit log.
- **Columns**:
  - `tx_id`: INT AUTO_INCREMENT PRIMARY KEY
  - `product_id`: INT NOT NULL (FK)
  - `tx_date`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `tx_type`: ENUM('production_add', 'sale_deduct', 'return_add', 'cancellation_add')
  - `quantity`: INT CHECK (quantity != 0)
  - `reference_id`: INT
  - `reference_type`: VARCHAR(50)
  - `notes`: TEXT
- **Relationships**: FK to products.
- **Triggers**: Updates products.current_stock on insert.
- **Example Data**:
  ```sql
  INSERT INTO inventory_transactions (product_id, tx_type, quantity) VALUES (1, 'production_add', 2000);
  -- ID: 1 (triggers stock update)
  ```

## Example Queries for Training
- Net Revenue: `SELECT SUM(i.total_amount - COALESCE(sr.total_returned_amount, 0)) FROM invoices i LEFT JOIN sales_returns sr ON i.invoice_id = sr.invoice_id;`
- Stock by Product: `SELECT p.name, p.current_stock FROM products p;`

This schema supports complex scenarios like partial deliveries, returns with refunds, and cancellations. For full training, load example data into `datasense` and generate synthetic datasets.
