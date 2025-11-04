-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: datasense
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cancellations`
--

DROP TABLE IF EXISTS `cancellations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancellations` (
  `cancellation_id` int NOT NULL AUTO_INCREMENT,
  `reference_id` int NOT NULL,
  `reference_type` enum('order','invoice') NOT NULL,
  `cancellation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` text NOT NULL,
  `notes` text,
  PRIMARY KEY (`cancellation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `challans`
--

DROP TABLE IF EXISTS `challans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challans` (
  `challan_id` int NOT NULL AUTO_INCREMENT,
  `load_plan_id` int NOT NULL,
  `challan_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details` json DEFAULT NULL,
  PRIMARY KEY (`challan_id`),
  KEY `load_plan_id` (`load_plan_id`),
  CONSTRAINT `challans_ibfk_1` FOREIGN KEY (`load_plan_id`) REFERENCES `load_plans` (`load_plan_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detailed_fg_store_req`
--

DROP TABLE IF EXISTS `detailed_fg_store_req`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detailed_fg_store_req` (
  `req_id` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `unique_id` varchar(100) NOT NULL,
  `req_from` varchar(10) DEFAULT NULL,
  `req_from_code` varchar(45) DEFAULT NULL,
  `req_from_name` varchar(100) DEFAULT NULL,
  `req_to` varchar(10) DEFAULT NULL,
  `req_to_code` varchar(45) DEFAULT NULL,
  `req_to_name` varchar(100) DEFAULT NULL,
  `requested_by` varchar(100) DEFAULT NULL,
  `requested_by_name` varchar(100) DEFAULT NULL,
  `requested_on` varchar(70) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `req_from_region` int DEFAULT NULL,
  `req_from_region_name` varchar(100) DEFAULT NULL,
  `req_from_depot` int DEFAULT NULL,
  `req_from_depot_name` varchar(100) DEFAULT NULL,
  `req_to_region` int DEFAULT NULL,
  `req_to_region_name` varchar(100) DEFAULT NULL,
  `req_to_depot` int DEFAULT NULL,
  `req_to_depot_name` varchar(100) DEFAULT NULL,
  `vehicle_id` varchar(100) DEFAULT NULL,
  `vehicle_name` varchar(100) DEFAULT NULL,
  `status_update` int NOT NULL,
  `cancel_status` int NOT NULL,
  `cancelled_on` varchar(50) DEFAULT NULL,
  `fg_store_id` int DEFAULT NULL,
  `fg_store_name` varchar(100) DEFAULT NULL,
  `fg_store_req_from_id` int DEFAULT NULL,
  `fg_store_req_from_name` varchar(100) DEFAULT NULL,
  `approved_on` varchar(70) DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_by_name` varchar(100) DEFAULT NULL,
  `vehicle_approved_on` varchar(100) DEFAULT NULL,
  `vehicle_approved_by` int DEFAULT NULL,
  `vehicle_approved_by_name` varchar(100) DEFAULT NULL,
  `unloaded_on` varchar(100) DEFAULT NULL,
  `unloaded_by` int DEFAULT NULL,
  `unloaded_by_name` varchar(100) DEFAULT NULL,
  `accepted_on` varchar(100) DEFAULT NULL,
  `accepted_by` int DEFAULT NULL,
  `accepted_by_name` varchar(100) DEFAULT NULL,
  `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'factory rcv note',
  `sent_note` longtext COMMENT 'Factory sent note ',
  PRIMARY KEY (`req_id`),
  KEY `req_from` (`req_from`),
  KEY `req_to` (`req_to`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `fg_store_id` (`fg_store_id`),
  KEY `status_update` (`status_update`),
  KEY `req_from_depot` (`req_from_depot`),
  KEY `req_to_depot` (`req_to_depot`)
) ENGINE=InnoDB AUTO_INCREMENT=9703 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detailed_fg_store_req_det`
--

DROP TABLE IF EXISTS `detailed_fg_store_req_det`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detailed_fg_store_req_det` (
  `req_det_id` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `fg_store_req_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_code` varchar(100) DEFAULT NULL,
  `product_name` varchar(155) DEFAULT NULL,
  `category` int DEFAULT NULL,
  `product_cat_name` varchar(255) DEFAULT NULL,
  `root_category` varchar(11) DEFAULT NULL,
  `root_category_name` varchar(255) DEFAULT NULL,
  `item_vol` varchar(100) DEFAULT NULL,
  `item_sz` varchar(100) DEFAULT NULL,
  `ctn_qty` varchar(10) DEFAULT NULL,
  `pcs_qty` varchar(100) DEFAULT NULL,
  `adj_ctn_qty` int DEFAULT NULL,
  `adj_pcs_qty` int DEFAULT NULL,
  `rcv_ctn_qty` int DEFAULT '0',
  `rcv_pcs_qty` int DEFAULT '0',
  `status` int DEFAULT '1',
  `sell_ctn_qty` int DEFAULT '0',
  `sell_pcs_qty` int DEFAULT '0',
  PRIMARY KEY (`req_det_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detailed_inv_details`
--

DROP TABLE IF EXISTS `detailed_inv_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detailed_inv_details` (
  `rel_id` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `inv_id` int NOT NULL,
  `product_id` int NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` int NOT NULL,
  `product_cat_name` varchar(255) NOT NULL,
  `root_category` int NOT NULL,
  `root_category_name` varchar(255) NOT NULL,
  `vol` decimal(16,2) NOT NULL,
  `ctnsz` int NOT NULL,
  `price_type` enum('MRP','TP','DP','SP') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `ctn_price` decimal(16,2) NOT NULL,
  `pc_price` decimal(16,2) NOT NULL DEFAULT '0.00',
  `pqty_in_ctn` int NOT NULL,
  `pqty_in_pcs` int NOT NULL DEFAULT '0',
  `a_qty_ctn` int NOT NULL DEFAULT '0',
  `a_qty_pcs` int NOT NULL,
  `compl_ctn` int NOT NULL DEFAULT '0',
  `compl_pcs` int NOT NULL,
  `line_total` decimal(16,2) NOT NULL,
  `is_gift` int NOT NULL DEFAULT '0' COMMENT 'offer products \r\n',
  `order_id` int NOT NULL,
  `inserted_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dlv_status` int NOT NULL DEFAULT '1' COMMENT '1 = delivered 0 = cancelled	',
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`rel_id`),
  KEY `ord_id` (`inv_id`,`product_id`,`is_gift`),
  KEY `inv` (`inv_id`,`product_id`,`root_category`,`category`,`pqty_in_ctn`,`dlv_status`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=1815630 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detailed_invoice`
--

DROP TABLE IF EXISTS `detailed_invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detailed_invoice` (
  `det_id` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `inv_date` date NOT NULL,
  `exp_delivery_date` date NOT NULL,
  `inv_number` varchar(50) NOT NULL,
  `demand_id` varchar(50) NOT NULL,
  `sales_ref_number` varchar(50) NOT NULL,
  `challan_number` varchar(50) NOT NULL,
  `grand_tot` decimal(16,2) NOT NULL,
  `discount` decimal(16,2) NOT NULL,
  `cash_com` decimal(16,2) NOT NULL,
  `dsr_com` decimal(16,2) NOT NULL,
  `total_payable` decimal(16,2) NOT NULL,
  `total_paid` decimal(16,2) NOT NULL,
  `created_by` int NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  `pay_status` enum('Canceled','Due','Paid','Settled') NOT NULL,
  `dlv_status` enum('Delivered','Partially Delivered','Pending','Cancelled','Partially Cancelled') NOT NULL DEFAULT 'Delivered',
  `route` int NOT NULL DEFAULT '0',
  `outlet` int NOT NULL DEFAULT '-1',
  `notes` longtext NOT NULL,
  `inv_ref_no` varchar(50) NOT NULL,
  `store_id` int NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `cancel_order` int NOT NULL DEFAULT '0',
  `req_id` int NOT NULL DEFAULT '0',
  `cancel_invoice` int NOT NULL DEFAULT '0',
  `region_id` int DEFAULT NULL,
  `region_name` varchar(255) DEFAULT NULL,
  `depot_id` int DEFAULT NULL,
  `depot_name` varchar(255) DEFAULT NULL,
  `area_id` int DEFAULT NULL,
  `area_name` varchar(255) DEFAULT NULL,
  `territory_id` int DEFAULT NULL,
  `territory_name` varchar(255) DEFAULT NULL,
  `distri_id` int NOT NULL,
  `distri_name` varchar(255) DEFAULT NULL,
  `distri_code` varchar(255) DEFAULT NULL,
  `d_identity` varchar(50) DEFAULT NULL,
  `month` int DEFAULT '0',
  `additional_address` text,
  `special_permission` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`det_id`),
  KEY `d_identity` (`d_identity`),
  KEY `grand_tot` (`grand_tot`),
  KEY `pay_status` (`pay_status`),
  KEY `territory_id` (`territory_id`),
  KEY `region_name` (`region_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=192396 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detailed_order`
--

DROP TABLE IF EXISTS `detailed_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detailed_order` (
  `rel_id` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `ord_date` date NOT NULL,
  `exp_delivery_date` varchar(50) NOT NULL,
  `ord_number` varchar(50) NOT NULL,
  `distri_id` int NOT NULL,
  `distri_code` varchar(50) NOT NULL,
  `distri_name` varchar(255) NOT NULL,
  `d_identity` varchar(50) NOT NULL,
  `grand_tot` decimal(16,2) NOT NULL,
  `discount` decimal(16,2) NOT NULL,
  `cash_com` decimal(16,2) NOT NULL,
  `dsr_com` decimal(16,2) NOT NULL,
  `total_payable` decimal(16,2) NOT NULL,
  `total_paid` decimal(16,2) NOT NULL,
  `created_by` int NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  `pay_status` enum('Canceled','Due','Paid','Settled') NOT NULL,
  `dlv_status` enum('Delivered','Partially Delivered','Pending','Cancelled','Partially Cancelled') NOT NULL DEFAULT 'Pending',
  `route` int NOT NULL DEFAULT '0',
  `outlet` int NOT NULL DEFAULT '-1',
  `notes` longtext,
  `inv_ref` varchar(50) DEFAULT NULL,
  `req_id` int NOT NULL,
  `region_id` varchar(255) DEFAULT '0',
  `region_name` varchar(255) DEFAULT NULL,
  `depot_id` varchar(255) DEFAULT '0',
  `depot_name` varchar(255) DEFAULT NULL,
  `area_id` int DEFAULT '0',
  `area_name` varchar(255) DEFAULT NULL,
  `territory_id` int DEFAULT '0',
  `territory_name` varchar(255) DEFAULT NULL,
  `month` int DEFAULT '0',
  `valid_till` date DEFAULT '0000-00-00',
  PRIMARY KEY (`rel_id`),
  KEY `ord_date` (`ord_date`),
  KEY `distri_id` (`distri_id`),
  KEY `d_identity` (`d_identity`),
  KEY `pay_status` (`pay_status`),
  KEY `dlv_status` (`dlv_status`),
  KEY `region_id` (`region_id`),
  KEY `depot_id` (`depot_id`),
  KEY `area_id` (`area_id`),
  KEY `territory_id` (`territory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=116703 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detailed_order_details`
--

DROP TABLE IF EXISTS `detailed_order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detailed_order_details` (
  `rel_id` bigint NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL DEFAULT '0',
  `ord_id` int NOT NULL,
  `product_id` int NOT NULL,
  `code` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `category` int DEFAULT NULL,
  `product_cat_name` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `root_category` int DEFAULT NULL,
  `root_category_name` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `vol` decimal(16,2) NOT NULL,
  `ctnsz` int NOT NULL,
  `price_type` enum('MRP','TP','DP','SP') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `ctn_price` decimal(16,2) NOT NULL,
  `pc_price` decimal(16,2) NOT NULL DEFAULT '0.00',
  `pqty_in_ctn` int NOT NULL,
  `pqty_in_pcs` int NOT NULL DEFAULT '0',
  `a_qty_ctn` int NOT NULL DEFAULT '0',
  `a_qty_pcs` int NOT NULL,
  `compl_ctn` int NOT NULL DEFAULT '0',
  `compl_pcs` int NOT NULL,
  `line_total` decimal(16,2) NOT NULL,
  `is_gift` int NOT NULL DEFAULT '0' COMMENT 'offer products \r\n',
  `is_active` int NOT NULL DEFAULT '1',
  `inv_id` int NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ofr_id` int DEFAULT '0',
  PRIMARY KEY (`rel_id`,`id`),
  KEY `ord_id` (`ord_id`),
  KEY `product_id` (`product_id`),
  KEY `category` (`category`),
  KEY `is_gift` (`is_gift`)
) ENGINE=InnoDB AUTO_INCREMENT=1316960 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `distributors`
--

DROP TABLE IF EXISTS `distributors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributors` (
  `distributor_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `registration_date` date NOT NULL DEFAULT (curdate()),
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`distributor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gate_passes`
--

DROP TABLE IF EXISTS `gate_passes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gate_passes` (
  `gate_pass_id` int NOT NULL AUTO_INCREMENT,
  `load_plan_id` int NOT NULL,
  `gate_pass_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details` json DEFAULT NULL,
  PRIMARY KEY (`gate_pass_id`),
  KEY `load_plan_id` (`load_plan_id`),
  CONSTRAINT `gate_passes_ibfk_1` FOREIGN KEY (`load_plan_id`) REFERENCES `load_plans` (`load_plan_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `tx_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `tx_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tx_type` enum('production_add','sale_deduct','return_add','cancellation_add') NOT NULL,
  `quantity` int NOT NULL,
  `reference_id` int DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`tx_id`),
  KEY `idx_inventory_product` (`product_id`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
  CONSTRAINT `inventory_transactions_chk_1` CHECK ((`quantity` <> 0))
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_items` (
  `invoice_item_id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity_invoiced` int NOT NULL,
  `quantity_delivered` int DEFAULT '0',
  `price_per_unit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`invoice_item_id`),
  UNIQUE KEY `invoice_id` (`invoice_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE,
  CONSTRAINT `invoice_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
  CONSTRAINT `invoice_items_chk_1` CHECK ((`quantity_invoiced` > 0)),
  CONSTRAINT `invoice_items_chk_2` CHECK ((`quantity_delivered` >= 0)),
  CONSTRAINT `invoice_items_chk_3` CHECK ((`price_per_unit` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `invoice_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `invoice_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('invoiced','partial_delivered','fully_delivered','returned','cancelled') NOT NULL DEFAULT 'invoiced',
  `total_amount` decimal(10,2) NOT NULL,
  `delivered_amount` decimal(10,2) DEFAULT '0.00',
  `notes` text,
  PRIMARY KEY (`invoice_id`),
  KEY `idx_invoices_order` (`order_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE RESTRICT,
  CONSTRAINT `invoices_chk_1` CHECK ((`total_amount` >= 0)),
  CONSTRAINT `invoices_chk_2` CHECK ((`delivered_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `load_plan_items`
--

DROP TABLE IF EXISTS `load_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `load_plan_items` (
  `load_plan_item_id` int NOT NULL AUTO_INCREMENT,
  `load_plan_id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'assigned',
  PRIMARY KEY (`load_plan_item_id`),
  UNIQUE KEY `load_plan_id` (`load_plan_id`,`invoice_id`),
  KEY `invoice_id` (`invoice_id`),
  CONSTRAINT `load_plan_items_ibfk_1` FOREIGN KEY (`load_plan_id`) REFERENCES `load_plans` (`load_plan_id`) ON DELETE CASCADE,
  CONSTRAINT `load_plan_items_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `load_plans`
--

DROP TABLE IF EXISTS `load_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `load_plans` (
  `load_plan_id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int NOT NULL,
  `plan_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) NOT NULL DEFAULT 'planned',
  PRIMARY KEY (`load_plan_id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `load_plans_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  UNIQUE KEY `order_id` (`order_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
  CONSTRAINT `order_items_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `order_items_chk_2` CHECK ((`price_per_unit` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `distributor_id` int NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('placed','invoiced','cancelled') NOT NULL DEFAULT 'placed',
  `total_amount` decimal(10,2) NOT NULL,
  `notes` text,
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_distributor` (`distributor_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`distributor_id`) REFERENCES `distributors` (`distributor_id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_chk_1` CHECK ((`total_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('cash','cheque','bank_deposit') NOT NULL,
  `cheque_number` varchar(100) DEFAULT NULL,
  `bank_deposit_ref` varchar(100) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`payment_id`),
  KEY `idx_payments_invoice` (`invoice_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE RESTRICT,
  CONSTRAINT `payments_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `unit_price` decimal(10,2) NOT NULL,
  `current_stock` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `name` (`name`),
  CONSTRAINT `products_chk_1` CHECK ((`unit_price` > 0)),
  CONSTRAINT `products_chk_2` CHECK ((`current_stock` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `refund_id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `refund_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('cash','cheque','bank_deposit','credit_note') NOT NULL,
  `reason` text,
  `status` enum('pending','issued','processed') NOT NULL DEFAULT 'pending',
  `reference_id` int DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`refund_id`),
  KEY `idx_refunds_invoice` (`invoice_id`),
  CONSTRAINT `refunds_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE RESTRICT,
  CONSTRAINT `refunds_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `return_items`
--

DROP TABLE IF EXISTS `return_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_items` (
  `return_item_id` int NOT NULL AUTO_INCREMENT,
  `return_id` int NOT NULL,
  `invoice_item_id` int NOT NULL,
  `quantity_returned` int NOT NULL,
  PRIMARY KEY (`return_item_id`),
  UNIQUE KEY `return_id` (`return_id`,`invoice_item_id`),
  KEY `invoice_item_id` (`invoice_item_id`),
  CONSTRAINT `return_items_ibfk_1` FOREIGN KEY (`return_id`) REFERENCES `sales_returns` (`return_id`) ON DELETE CASCADE,
  CONSTRAINT `return_items_ibfk_2` FOREIGN KEY (`invoice_item_id`) REFERENCES `invoice_items` (`invoice_item_id`) ON DELETE RESTRICT,
  CONSTRAINT `return_items_chk_1` CHECK ((`quantity_returned` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sales_returns`
--

DROP TABLE IF EXISTS `sales_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_returns` (
  `return_id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `return_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` text NOT NULL,
  `total_returned_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processed') NOT NULL DEFAULT 'pending',
  `notes` text,
  PRIMARY KEY (`return_id`),
  KEY `idx_returns_invoice` (`invoice_id`),
  CONSTRAINT `sales_returns_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE RESTRICT,
  CONSTRAINT `sales_returns_chk_1` CHECK ((`total_returned_amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `plate_number` varchar(50) NOT NULL,
  `capacity` int NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`vehicle_id`),
  UNIQUE KEY `plate_number` (`plate_number`),
  CONSTRAINT `vehicles_chk_1` CHECK ((`capacity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-04  9:58:12
