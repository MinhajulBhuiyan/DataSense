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

## Table Descriptions (accurate, consolidated)

Below is a concise, accurate summary of every table present in the current `datasense` schema (derived from `create-datasense.sql`). For each table we list the primary key, important columns, constraints and foreign key relations.

- cancellations
  - PK: `cancellation_id`
  - Important columns: `reference_id`, `reference_type` (enum 'order'|'invoice'), `cancellation_date`, `reason`, `notes`.

- challans
  - PK: `challan_id`
  - Important columns: `load_plan_id` (FK -> `load_plans.load_plan_id`), `challan_date`, `details` (JSON).

- detailed_fg_store_req
  - PK: `req_id`
  - Large denormalized detail table used by FG store requests. Contains fields like `unique_id`, `req_from`, `req_to`, `requested_by`, `requested_on`, region/depot/store metadata, `vehicle_id`, approval/audit fields, `status_update`, `cancel_status`, notes and longtext `note`/`sent_note`.

- detailed_fg_store_req_det
  - PK: `req_det_id`
  - Line-level details for FG store requests: `fg_store_req_id`, `product_id`, `product_code`, `product_name`, category fields, quantities (`rcv_ctn_qty`, `rcv_pcs_qty`, `adj_ctn_qty`, `adj_pcs_qty`), status and sell quantities.

- detailed_inv_details
  - PK: `rel_id`
  - Invoice detail lines in a denormalized format: `inv_id`, `product_id`, `code`, `name`, category and root_category, volume `vol`, price fields (`ctn_price`, `pc_price`), quantities and `line_total`, `order_id`, delivery status and activity flags.

- detailed_invoice
  - PK: `det_id`
  - Denormalized invoice header: `inv_number`, `inv_date`, `distri_id`, pricing totals (`grand_tot`, `discount`, `total_payable`, `total_paid`), `pay_status`/`dlv_status` enums, route/outlet/store/region/depot/territory metadata, `notes`, flags like `cancel_order`/`cancel_invoice` and timestamps.

- detailed_order
  - PK: `rel_id`
  - Denormalized order header: `ord_number`, `ord_date`, `distri_id`, `distri_name`, `grand_tot`, payment/delivery status enums, region/depot/area/territory metadata and timestamps.

- detailed_order_details
  - PK: composite (`rel_id`,`id`)
  - Denormalized order line: `ord_id`, `product_id`, `price_type`, `ctn_price`, `pc_price`, pack sizes, `line_total`, `is_gift`, `is_active`, timestamps.

- distributors
  - PK: `distributor_id`
  - Columns: `name`, `address`, `contact_phone`, `contact_email`, `registration_date`, `is_active`.

- gate_passes
  - PK: `gate_pass_id`
  - Important columns: `load_plan_id` (FK -> `load_plans.load_plan_id`), `gate_pass_date`, `details` (JSON).

- inventory_transactions
  - PK: `tx_id`
  - Important columns: `product_id` (FK -> `products.product_id`), `tx_date`, `tx_type` (enum), `quantity`, `reference_id`, `reference_type`, `notes`.
  - Constraint: quantity != 0. Triggers typically update `products.current_stock`.

- invoice_items
  - PK: `invoice_item_id`
  - Important columns: `invoice_id` (FK -> `invoices.invoice_id`), `product_id` (FK -> `products.product_id`), `quantity_invoiced`, `quantity_delivered`, `price_per_unit`.
  - Constraints: `quantity_invoiced`>0, `quantity_delivered`>=0, `price_per_unit`>0. Unique index on (`invoice_id`,`product_id`).

- invoices
  - PK: `invoice_id`
  - Important columns: `order_id` (FK -> `orders.order_id`), `invoice_date`, `status` (enum), `total_amount`, `delivered_amount`, `notes`.
  - Constraints: `total_amount`>=0, `delivered_amount`>=0.

- load_plan_items
  - PK: `load_plan_item_id`
  - Important columns: `load_plan_id` (FK), `invoice_id` (FK), `status`.
  - Unique index on (`load_plan_id`,`invoice_id`).

- load_plans
  - PK: `load_plan_id`
  - Important columns: `vehicle_id` (FK -> `vehicles.vehicle_id`), `plan_date`, `status`.

- order_items
  - PK: `order_item_id`
  - Important columns: `order_id` (FK -> `orders.order_id`), `product_id` (FK), `quantity`, `price_per_unit`.
  - Constraints: `quantity`>0, `price_per_unit`>0. Unique index on (`order_id`,`product_id`).

- orders
  - PK: `order_id`
  - Important columns: `distributor_id` (FK -> `distributors.distributor_id`), `order_date`, `status` (enum), `total_amount`, `notes`.
  - Constraint: `total_amount`>=0.

- payments
  - PK: `payment_id`
  - Important columns: `invoice_id` (FK -> `invoices.invoice_id`), `payment_date`, `amount`, `method` (enum), `cheque_number`, `bank_deposit_ref`, `notes`.
  - Constraint: `amount`>0.

- products
  - PK: `product_id`
  - Important columns: `name` (unique), `description`, `unit_price`, `current_stock`, `is_active`.
  - Constraints: `unit_price`>0, `current_stock`>=0.

- refunds
  - PK: `refund_id`
  - Important columns: `invoice_id` (FK -> `invoices.invoice_id`), `refund_date`, `amount`, `method` (enum), `reason`, `status` (enum), `reference_id`, `reference_type`, `notes`.
  - Constraint: `amount`>0.

- return_items
  - PK: `return_item_id`
  - Important columns: `return_id` (FK -> `sales_returns.return_id`), `invoice_item_id` (FK -> `invoice_items.invoice_item_id`), `quantity_returned`.
  - Constraint: `quantity_returned`>0. Unique index on (`return_id`,`invoice_item_id`).

- sales_returns
  - PK: `return_id`
  - Important columns: `invoice_id` (FK -> `invoices.invoice_id`), `return_date`, `reason`, `total_returned_amount`, `status` (enum), `notes`.
  - Constraint: `total_returned_amount`>0.

- vehicles
  - PK: `vehicle_id`
  - Important columns: `plate_number` (unique), `capacity`, `description`, `is_active`.
  - Constraint: `capacity`>0.

The schema above matches the exact table list and key constraints found in `create-datasense.sql` (23 tables). Use these definitions as the canonical source when generating prompts, building training examples, and validating generated SQL. For any production execution, always run generated SQL in a sandbox MySQL instance first and verify expected results.

## Example Queries for Training
- Net Revenue: `SELECT SUM(i.total_amount - COALESCE(sr.total_returned_amount, 0)) FROM invoices i LEFT JOIN sales_returns sr ON i.invoice_id = sr.invoice_id;`
- Stock by Product: `SELECT p.name, p.current_stock FROM products p;`

This schema supports complex scenarios like partial deliveries, returns with refunds, and cancellations. For full training, load example data into `datasense` and generate synthetic datasets.