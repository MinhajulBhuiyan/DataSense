/*
-- Query: SELECT * FROM datasense.cancellations
LIMIT 0, 1000

-- Date: 2025-11-03 12:04
*/
INSERT INTO `` (`cancellation_id`,`reference_id`,`reference_type`,`cancellation_date`,`reason`,`notes`) VALUES (1,5,'order','2024-09-02 12:00:00','Distributor changed mind',NULL);
INSERT INTO `` (`cancellation_id`,`reference_id`,`reference_type`,`cancellation_date`,`reason`,`notes`) VALUES (2,5,'invoice','2024-09-25 15:00:00','Logistics issue',NULL);
/*
-- Query: SELECT * FROM datasense.challans
LIMIT 0, 1000

-- Date: 2025-11-03 12:05
*/
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (1,1,'2024-05-06 08:30:00','{\"items\": [\"Invoice 1\"], \"total_units\": 300}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (2,2,'2024-06-06 08:30:00','{\"items\": [\"Invoice 2\"], \"total_units\": 400}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (3,3,'2024-07-06 08:30:00','{\"items\": [\"Invoice 3\"], \"total_units\": 550}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (4,4,'2024-08-06 08:30:00','{\"items\": [\"Invoice 4\"], \"total_units\": 300}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (5,5,'2024-10-06 08:30:00','{\"items\": [\"Invoice 6\", \"Invoice 7\"], \"total_units\": 350}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (6,6,'2024-10-16 08:30:00','{\"items\": [\"Invoice 8\"], \"total_units\": 100}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (7,7,'2024-10-23 08:30:00','{\"items\": [\"Invoice 9\"], \"total_units\": 100}');
INSERT INTO `` (`challan_id`,`load_plan_id`,`challan_date`,`details`) VALUES (8,8,'2024-10-27 08:30:00','{\"items\": [\"Invoice 10\"], \"total_units\": 450}');
/*
-- Query: SELECT * FROM datasense.distributors
LIMIT 0, 1000

-- Date: 2025-11-03 12:05
*/
INSERT INTO `` (`distributor_id`,`name`,`address`,`contact_phone`,`contact_email`,`registration_date`,`is_active`) VALUES (1,'DistribCo North','123 North St, City A','555-1234','north@distribco.com','2024-01-01',1);
INSERT INTO `` (`distributor_id`,`name`,`address`,`contact_phone`,`contact_email`,`registration_date`,`is_active`) VALUES (2,'DistribCo South','456 South St, City B','555-5678','south@distribco.com','2024-02-01',1);
INSERT INTO `` (`distributor_id`,`name`,`address`,`contact_phone`,`contact_email`,`registration_date`,`is_active`) VALUES (3,'DistribCo East','789 East Ave, City C','555-9012','east@distribco.com','2024-03-01',1);
INSERT INTO `` (`distributor_id`,`name`,`address`,`contact_phone`,`contact_email`,`registration_date`,`is_active`) VALUES (4,'DistribCo West','101 West Blvd, City D','555-3456','west@distribco.com','2024-04-01',1);
/*
-- Query: SELECT * FROM datasense.gate_passes
LIMIT 0, 1000

-- Date: 2025-11-03 12:06
*/
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (1,1,'2024-05-06 08:45:00','{\"driver\": \"John Doe\", \"vehicle\": \"VAN-001\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (2,2,'2024-06-06 08:45:00','{\"driver\": \"Jane Smith\", \"vehicle\": \"VAN-002\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (3,3,'2024-07-06 08:45:00','{\"driver\": \"John Doe\", \"vehicle\": \"VAN-001\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (4,4,'2024-08-06 08:45:00','{\"driver\": \"Jane Smith\", \"vehicle\": \"VAN-002\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (5,5,'2024-10-06 08:45:00','{\"driver\": \"John Doe\", \"vehicle\": \"VAN-001\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (6,6,'2024-10-16 08:45:00','{\"driver\": \"Jane Smith\", \"vehicle\": \"VAN-002\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (7,7,'2024-10-23 08:45:00','{\"driver\": \"John Doe\", \"vehicle\": \"VAN-001\"}');
INSERT INTO `` (`gate_pass_id`,`load_plan_id`,`gate_pass_date`,`details`) VALUES (8,8,'2024-10-27 08:45:00','{\"driver\": \"Jane Smith\", \"vehicle\": \"VAN-002\"}');
/*
-- Query: SELECT * FROM datasense.inventory_transactions
LIMIT 0, 1000

-- Date: 2025-11-03 12:07
*/
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (1,1,'2024-01-10 09:00:00','production_add',2000,NULL,'production','Initial batch');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (2,2,'2024-01-10 09:00:00','production_add',1500,NULL,'production','Initial batch');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (3,3,'2024-01-10 09:00:00','production_add',1200,NULL,'production','Initial batch');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (4,4,'2024-01-10 09:00:00','production_add',1000,NULL,'production','Initial batch');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (5,5,'2024-01-10 09:00:00','production_add',800,NULL,'production','Initial batch');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (6,1,'2024-05-05 14:00:00','sale_deduct',-200,1,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (7,2,'2024-05-05 14:00:00','sale_deduct',-100,1,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (8,2,'2024-06-05 14:00:00','sale_deduct',-200,2,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (9,3,'2024-06-05 14:00:00','sale_deduct',-200,2,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (10,1,'2024-07-05 14:00:00','sale_deduct',-300,3,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (11,4,'2024-07-05 14:00:00','sale_deduct',-150,3,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (12,5,'2024-07-05 14:00:00','sale_deduct',-100,3,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (13,4,'2024-07-15 15:00:00','return_add',150,1,'return',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (14,2,'2024-08-05 14:00:00','sale_deduct',-150,4,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (15,3,'2024-08-05 14:00:00','sale_deduct',-150,4,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (16,2,'2024-08-10 15:00:00','return_add',150,2,'return',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (17,3,'2024-08-10 15:00:00','return_add',150,2,'return',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (18,5,'2024-09-20 14:00:00','sale_deduct',-200,5,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (19,5,'2024-09-25 15:00:00','cancellation_add',200,5,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (20,1,'2024-10-05 14:00:00','sale_deduct',-100,6,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (21,2,'2024-10-05 14:00:00','sale_deduct',-100,6,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (22,3,'2024-10-05 14:30:00','sale_deduct',-100,7,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (23,4,'2024-10-05 14:30:00','sale_deduct',-50,7,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (24,3,'2024-10-15 15:00:00','return_add',100,3,'return',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (25,4,'2024-10-15 15:00:00','return_add',50,3,'return',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (26,5,'2024-10-15 14:00:00','sale_deduct',-100,8,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (27,1,'2024-10-20 09:00:00','production_add',500,NULL,'production','Replenish low stock');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (28,2,'2024-10-20 09:00:00','production_add',300,NULL,'production','Replenish low stock');
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (29,1,'2024-10-22 14:00:00','sale_deduct',-100,9,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (30,2,'2024-10-26 14:00:00','sale_deduct',-200,10,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (31,3,'2024-10-26 14:00:00','sale_deduct',-200,10,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (32,4,'2024-10-26 14:00:00','sale_deduct',-50,10,'invoice',NULL);
INSERT INTO `` (`tx_id`,`product_id`,`tx_date`,`tx_type`,`quantity`,`reference_id`,`reference_type`,`notes`) VALUES (33,3,'2024-10-28 15:00:00','return_add',200,4,'return',NULL);
/*
-- Query: SELECT * FROM datasense.invoice_items
LIMIT 0, 1000

-- Date: 2025-11-03 12:07
*/
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (1,1,1,200,200,5.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (2,1,2,100,100,6.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (3,2,2,200,150,6.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (4,2,3,200,200,5.50);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (5,3,1,300,300,5.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (6,3,4,150,150,6.50);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (7,3,5,100,100,7.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (8,4,2,150,150,6.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (9,4,3,150,150,5.50);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (10,5,5,200,0,7.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (11,6,1,100,100,5.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (12,6,2,100,100,6.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (13,7,3,100,100,5.50);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (14,7,4,50,50,6.50);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (15,8,5,100,100,7.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (16,9,1,100,100,5.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (17,10,2,200,200,6.00);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (18,10,3,200,200,5.50);
INSERT INTO `` (`invoice_item_id`,`invoice_id`,`product_id`,`quantity_invoiced`,`quantity_delivered`,`price_per_unit`) VALUES (19,10,4,50,50,6.50);
/*
-- Query: SELECT * FROM datasense.invoices
LIMIT 0, 1000

-- Date: 2025-11-03 12:07
*/
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (1,1,'2024-05-05 14:00:00','fully_delivered',1500.00,1500.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (2,2,'2024-06-05 14:00:00','partial_delivered',2200.00,1700.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (3,3,'2024-07-05 14:00:00','partial_delivered',3000.00,3000.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (4,4,'2024-08-05 14:00:00','returned',1800.00,1800.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (5,6,'2024-09-20 14:00:00','cancelled',1400.00,0.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (6,7,'2024-10-05 14:00:00','fully_delivered',1200.00,1200.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (7,8,'2024-10-05 14:30:00','returned',800.00,800.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (8,9,'2024-10-15 14:00:00','fully_delivered',700.00,700.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (9,10,'2024-10-22 14:00:00','fully_delivered',500.00,500.00,NULL);
INSERT INTO `` (`invoice_id`,`order_id`,`invoice_date`,`status`,`total_amount`,`delivered_amount`,`notes`) VALUES (10,11,'2024-10-26 14:00:00','partial_delivered',2500.00,2500.00,NULL);
/*
-- Query: SELECT * FROM datasense.load_plan_items
LIMIT 0, 1000

-- Date: 2025-11-03 12:08
*/
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (1,1,1,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (2,2,2,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (3,3,3,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (4,4,4,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (5,5,6,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (6,5,7,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (7,6,8,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (8,7,9,'delivered');
INSERT INTO `` (`load_plan_item_id`,`load_plan_id`,`invoice_id`,`status`) VALUES (9,8,10,'delivered');
/*
-- Query: SELECT * FROM datasense.load_plans
LIMIT 0, 1000

-- Date: 2025-11-03 12:08
*/
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (1,1,'2024-05-06 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (2,2,'2024-06-06 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (3,1,'2024-07-06 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (4,2,'2024-08-06 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (5,1,'2024-10-06 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (6,2,'2024-10-16 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (7,1,'2024-10-23 08:00:00','completed');
INSERT INTO `` (`load_plan_id`,`vehicle_id`,`plan_date`,`status`) VALUES (8,2,'2024-10-27 08:00:00','completed');
/*
-- Query: SELECT * FROM datasense.order_items
LIMIT 0, 1000

-- Date: 2025-11-03 12:09
*/
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (1,1,1,200,5.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (2,1,2,100,6.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (3,2,2,200,6.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (4,2,3,200,5.50);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (5,3,1,300,5.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (6,3,4,150,6.50);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (7,3,5,100,7.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (8,4,2,150,6.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (9,4,3,150,5.50);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (10,5,1,200,5.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (11,6,5,200,7.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (12,7,1,100,5.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (13,7,2,100,6.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (14,8,3,100,5.50);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (15,8,4,50,6.50);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (16,9,5,100,7.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (17,10,1,100,5.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (18,11,2,200,6.00);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (19,11,3,200,5.50);
INSERT INTO `` (`order_item_id`,`order_id`,`product_id`,`quantity`,`price_per_unit`) VALUES (20,11,4,50,6.50);
/*
-- Query: SELECT * FROM datasense.orders
LIMIT 0, 1000

-- Date: 2025-11-03 12:09
*/
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (1,1,'2024-05-01 10:00:00','invoiced',1500.00,'Standard order');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (2,2,'2024-06-01 10:00:00','invoiced',2200.00,'Partial delivery expected');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (3,3,'2024-07-01 10:00:00','invoiced',3000.00,'Order with returns');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (4,4,'2024-08-01 10:00:00','invoiced',1800.00,'Full return scenario');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (5,1,'2024-09-01 10:00:00','cancelled',1000.00,'Cancelled before invoice');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (6,2,'2024-09-15 10:00:00','cancelled',1400.00,'Cancelled after invoice');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (7,3,'2024-10-01 10:00:00','invoiced',1200.00,'Grouped load order 1');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (8,3,'2024-10-01 11:00:00','invoiced',800.00,'Grouped load order 2');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (9,4,'2024-10-10 10:00:00','invoiced',700.00,'Overdue scenario');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (10,1,'2024-10-20 10:00:00','invoiced',500.00,'Overpayment scenario');
INSERT INTO `` (`order_id`,`distributor_id`,`order_date`,`status`,`total_amount`,`notes`) VALUES (11,2,'2024-10-25 10:00:00','invoiced',2500.00,'Complex mixed scenario');
/*
-- Query: SELECT * FROM datasense.payments
LIMIT 0, 1000

-- Date: 2025-11-03 12:10
*/
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (1,1,'2024-05-10 11:00:00',1500.00,'cash',NULL,NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (2,2,'2024-06-10 11:00:00',1700.00,'cheque','CHK123',NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (3,3,'2024-07-10 11:00:00',3000.00,'bank_deposit',NULL,NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (4,6,'2024-10-10 11:00:00',1200.00,'cash',NULL,NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (5,7,'2024-10-09 11:00:00',400.00,'cash',NULL,NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (6,9,'2024-10-25 11:00:00',600.00,'cash',NULL,NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (7,10,'2024-10-27 11:00:00',1000.00,'cheque','CHK456',NULL,NULL);
INSERT INTO `` (`payment_id`,`invoice_id`,`payment_date`,`amount`,`method`,`cheque_number`,`bank_deposit_ref`,`notes`) VALUES (8,10,'2024-10-27 12:00:00',500.00,'cash',NULL,NULL,NULL);
/*
-- Query: SELECT * FROM datasense.products
LIMIT 0, 1000

-- Date: 2025-11-03 12:12
*/
INSERT INTO `` (`product_id`,`name`,`description`,`unit_price`,`current_stock`,`is_active`) VALUES (1,'Vanilla Delight','Classic vanilla ice cream',5.00,1800,1);
INSERT INTO `` (`product_id`,`name`,`description`,`unit_price`,`current_stock`,`is_active`) VALUES (2,'Chocolate Supreme','Rich chocolate ice cream',6.00,1200,1);
INSERT INTO `` (`product_id`,`name`,`description`,`unit_price`,`current_stock`,`is_active`) VALUES (3,'Strawberry Swirl','Strawberry with swirls',5.50,1000,1);
INSERT INTO `` (`product_id`,`name`,`description`,`unit_price`,`current_stock`,`is_active`) VALUES (4,'Mint Chip','Mint ice cream with chocolate chips',6.50,950,1);
INSERT INTO `` (`product_id`,`name`,`description`,`unit_price`,`current_stock`,`is_active`) VALUES (5,'Cookie Dough','Vanilla with cookie dough chunks',7.00,600,1);
/*
-- Query: SELECT * FROM datasense.refunds
LIMIT 0, 1000

-- Date: 2025-11-03 12:12
*/
INSERT INTO `` (`refund_id`,`invoice_id`,`refund_date`,`amount`,`method`,`reason`,`status`,`reference_id`,`reference_type`,`notes`) VALUES (1,3,'2024-07-20 16:00:00',975.00,'bank_deposit','Refund for damaged return','processed',1,'return',NULL);
INSERT INTO `` (`refund_id`,`invoice_id`,`refund_date`,`amount`,`method`,`reason`,`status`,`reference_id`,`reference_type`,`notes`) VALUES (2,7,'2024-10-20 16:00:00',400.00,'cash','Refund for full return','processed',3,'return',NULL);
INSERT INTO `` (`refund_id`,`invoice_id`,`refund_date`,`amount`,`method`,`reason`,`status`,`reference_id`,`reference_type`,`notes`) VALUES (3,9,'2024-10-27 16:00:00',100.00,'cash','Overpayment refund','processed',NULL,NULL,NULL);
INSERT INTO `` (`refund_id`,`invoice_id`,`refund_date`,`amount`,`method`,`reason`,`status`,`reference_id`,`reference_type`,`notes`) VALUES (4,10,'2024-10-28 16:00:00',100.00,'cash','Refund after partial return','processed',4,'return',NULL);
/*
-- Query: SELECT * FROM datasense.return_items
LIMIT 0, 1000

-- Date: 2025-11-03 12:12
*/
INSERT INTO `` (`return_item_id`,`return_id`,`invoice_item_id`,`quantity_returned`) VALUES (1,1,3,150);
INSERT INTO `` (`return_item_id`,`return_id`,`invoice_item_id`,`quantity_returned`) VALUES (2,2,5,150);
INSERT INTO `` (`return_item_id`,`return_id`,`invoice_item_id`,`quantity_returned`) VALUES (3,2,6,150);
INSERT INTO `` (`return_item_id`,`return_id`,`invoice_item_id`,`quantity_returned`) VALUES (4,3,9,100);
INSERT INTO `` (`return_item_id`,`return_id`,`invoice_item_id`,`quantity_returned`) VALUES (5,3,10,50);
INSERT INTO `` (`return_item_id`,`return_id`,`invoice_item_id`,`quantity_returned`) VALUES (6,4,12,200);
/*
-- Query: SELECT * FROM datasense.sales_returns
LIMIT 0, 1000

-- Date: 2025-11-03 12:12
*/
INSERT INTO `` (`return_id`,`invoice_id`,`return_date`,`reason`,`total_returned_amount`,`status`,`notes`) VALUES (1,3,'2024-07-15 15:00:00','Damaged items',975.00,'processed',NULL);
INSERT INTO `` (`return_id`,`invoice_id`,`return_date`,`reason`,`total_returned_amount`,`status`,`notes`) VALUES (2,4,'2024-08-10 15:00:00','Customer rejection',1800.00,'processed',NULL);
INSERT INTO `` (`return_id`,`invoice_id`,`return_date`,`reason`,`total_returned_amount`,`status`,`notes`) VALUES (3,7,'2024-10-15 15:00:00','Quality issue',800.00,'processed',NULL);
INSERT INTO `` (`return_id`,`invoice_id`,`return_date`,`reason`,`total_returned_amount`,`status`,`notes`) VALUES (4,10,'2024-10-28 15:00:00','Partial damage',1100.00,'processed',NULL);
/*
-- Query: SELECT * FROM datasense.vehicles
LIMIT 0, 1000

-- Date: 2025-11-03 12:13
*/
INSERT INTO `` (`vehicle_id`,`plate_number`,`capacity`,`description`,`is_active`) VALUES (1,'VAN-001',5000,'Large delivery van',1);
INSERT INTO `` (`vehicle_id`,`plate_number`,`capacity`,`description`,`is_active`) VALUES (2,'VAN-002',3000,'Medium delivery van',1);
