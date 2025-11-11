-- Table structure for table `detailed_fg_store_req`
DROP TABLE IF EXISTS `detailed_fg_store_req`;
CREATE TABLE `detailed_fg_store_req` (
  `req_id` int NOT NULL AUTO_INCREMENT COMMENT 'Request ID: Primary key. Unique numeric identifier for each finished-goods transfer request (internal reference).',
  `id` int NOT NULL COMMENT 'Legacy ID: Alternate numeric identifier used by the source system; retained for mapping and historical lookups.',
  `unique_id` varchar(100) NOT NULL COMMENT 'Unique Request ID: External/global string identifier used for cross-system tracking (e.g., "FGREQ-2025-000123").',
  `req_from` varchar(10) DEFAULT NULL COMMENT 'Origin Code: Short code for source location (warehouse/factory/store), e.g., "WH01".',
  `req_from_code` varchar(45) DEFAULT NULL COMMENT 'Origin Location Code (Extended): Longer ERP/legacy location code for the origin (may include region prefixes).',
  `req_from_name` varchar(100) DEFAULT NULL COMMENT 'Origin Name: Full textual name of the origin location (factory or warehouse).',
  `req_to` varchar(10) DEFAULT NULL COMMENT 'Destination Code: Short code for destination location (depot/store), e.g., "DPT05".',
  `req_to_code` varchar(45) DEFAULT NULL COMMENT 'Destination Location Code (Extended): Longer internal/ERP code for the destination.',
  `req_to_name` varchar(100) DEFAULT NULL COMMENT 'Destination Name: Full textual name of the destination location (store or depot).',
  `requested_by` varchar(100) DEFAULT NULL COMMENT 'Requested By ID: Identifier or user code of the person who created the request (system/user id string).',
  `requested_by_name` varchar(100) DEFAULT NULL COMMENT 'Requested By Name: Full name of requester for audit and display purposes.',
  `requested_on` varchar(70) DEFAULT NULL COMMENT 'Requested On: Creation timestamp stored as string for legacy compatibility (format often "YYYY-MM-DD HH:MM:SS").',
  `status` varchar(10) DEFAULT NULL COMMENT 'Request Status: Current workflow state; allowed values typically include "Pending", "Approved", "Cancelled", etc.',
  `req_from_region` int DEFAULT NULL COMMENT 'Origin Region ID: Numeric region identifier associated with origin (used for reporting and grouping).',
  `req_from_region_name` varchar(100) DEFAULT NULL COMMENT 'Origin Region Name: Text name for the origin region (e.g., "North Zone").',
  `req_from_depot` int DEFAULT NULL COMMENT 'Origin Depot ID: Numeric depot identifier at the origin used for stock reconciliation.',
  `req_from_depot_name` varchar(100) DEFAULT NULL COMMENT 'Origin Depot Name: Depot name text used for display and reports.',
  `req_to_region` int DEFAULT NULL COMMENT 'Destination Region ID: Numeric region identifier for destination.',
  `req_to_region_name` varchar(100) DEFAULT NULL COMMENT 'Destination Region Name: Text name for destination region.',
  `req_to_depot` int DEFAULT NULL COMMENT 'Destination Depot ID: Numeric depot id for destination used for inventory update.',
  `req_to_depot_name` varchar(100) DEFAULT NULL COMMENT 'Destination Depot Name: Destination depot name for user interfaces and logs.',
  `vehicle_id` varchar(100) DEFAULT NULL COMMENT 'Vehicle ID: Identifier assigned to the vehicle handling this transfer (fleet reference or UUID).',
  `vehicle_name` varchar(100) DEFAULT NULL COMMENT 'Vehicle Name or Plate: Vehicle description or license plate number used for transport tracking.',
  `status_update` int NOT NULL COMMENT 'Status Update Code: Numeric lifecycle stage code (example mapping: 0=Created,1=Approved,2=Loaded,3=In Transit,4=Delivered).',
  `cancel_status` int NOT NULL COMMENT 'Cancel Status Flag: Binary flag indicating cancellation state (0 = active/not cancelled, 1 = cancelled).',
  `cancelled_on` varchar(50) DEFAULT NULL COMMENT 'Cancelled On: Timestamp when request was cancelled (stored as string), null if not cancelled.',
  `fg_store_id` int DEFAULT NULL COMMENT 'Receiving Finished Goods Store ID: Numeric ID of the finished-goods store receiving the shipment (inventory target).',
  `fg_store_name` varchar(100) DEFAULT NULL COMMENT 'Receiving Finished Goods Store Name: Display name of the receiving store used on UIs/reports.',
  `fg_store_req_from_id` int DEFAULT NULL COMMENT 'Requesting Finished Goods Store ID: Numeric ID of the store which initiated the request (when different from receiver).',
  `fg_store_req_from_name` varchar(100) DEFAULT NULL COMMENT 'Requesting Finished Goods Store Name: Display name of the store that requested goods.',
  `approved_on` varchar(70) DEFAULT NULL COMMENT 'Approved On: Timestamp when the request was approved (string format for legacy compatibility).',
  `approved_by` int DEFAULT NULL COMMENT 'Approved By User ID: Numeric user id of the approver used for audit trails.',
  `approved_by_name` varchar(100) DEFAULT NULL COMMENT 'Approved By Name: Full name of the approving user for reporting.',
  `vehicle_approved_on` varchar(100) DEFAULT NULL COMMENT 'Vehicle Approved On: Timestamp when assigned vehicle was approved for the transfer.',
  `vehicle_approved_by` int DEFAULT NULL COMMENT 'Vehicle Approved By ID: Numeric user id who approved the vehicle assignment.',
  `vehicle_approved_by_name` varchar(100) DEFAULT NULL COMMENT 'Vehicle Approved By Name: Name of user who approved vehicle assignment.',
  `unloaded_on` varchar(100) DEFAULT NULL COMMENT 'Unloaded On: Timestamp when cargo was unloaded at destination (string).',
  `unloaded_by` int DEFAULT NULL COMMENT 'Unloaded By User ID: Numeric id of staff who physically unloaded goods (for accountability).',
  `unloaded_by_name` varchar(100) DEFAULT NULL COMMENT 'Unloaded By Name: Name of the person who unloaded goods recorded for audit.',
  `accepted_on` varchar(100) DEFAULT NULL COMMENT 'Accepted On: Timestamp when destination officially accepted the goods (string).',
  `accepted_by` int DEFAULT NULL COMMENT 'Accepted By User ID: Numeric id of staff who confirmed acceptance of goods.',
  `accepted_by_name` varchar(100) DEFAULT NULL COMMENT 'Accepted By Name: Full name of the staff who accepted the shipment (for records).',
  `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Internal Notes: Detailed instructions, exceptions, or observations recorded by origin store (e.g., "fragile; handle with care").',
  `sent_note` longtext COMMENT 'Sent Notes: Text notes transmitted with the request for delivery or handling instructions.',
  PRIMARY KEY (`req_id`),
  KEY `req_from` (`req_from`),
  KEY `req_to` (`req_to`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `fg_store_id` (`fg_store_id`),
  KEY `status_update` (`status_update`),
  KEY `req_from_depot` (`req_from_depot`),
  KEY `req_to_depot` (`req_to_depot`)
) ENGINE=InnoDB AUTO_INCREMENT=9703 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
















-- Table structure for table `detailed_fg_store_req_det`
DROP TABLE IF EXISTS `detailed_fg_store_req_det`;
CREATE TABLE `detailed_fg_store_req_det` (
  `req_det_id` int NOT NULL AUTO_INCREMENT COMMENT 'Request Detail ID: Primary key for each item line within a finished-goods transfer request.',
  `id` int NOT NULL COMMENT 'Legacy ID: Alternate source-system identifier for mapping individual detail lines.',
  `fg_store_req_id` int NOT NULL COMMENT 'Finished Goods Store Request ID: FK linking this detail to detailed_fg_store_req.req_id.',
  `product_id` int NOT NULL COMMENT 'Product ID: Internal numeric identifier for the product (references products.id).',
  `product_code` varchar(100) DEFAULT NULL COMMENT 'Product Code (SKU): Internal SKU or product code string for quick lookup.',
  `product_name` varchar(155) DEFAULT NULL COMMENT 'Product Name: Display name used on UIs and printed documents.',
  `category` int DEFAULT NULL COMMENT 'Product Category ID: Numeric id referencing product category for classification and reporting.',
  `product_cat_name` varchar(255) DEFAULT NULL COMMENT 'Product Category Name: Text name of the product category used in displays/reports.',
  `root_category` varchar(11) DEFAULT NULL COMMENT 'Root Category Code: Code of the top-level category used for high-level aggregation.',
  `root_category_name` varchar(255) DEFAULT NULL COMMENT 'Root Category Name: Text name of top-level category used for reporting.',
  `item_vol` varchar(100) DEFAULT NULL COMMENT 'Item Volume Description: Text describing volume/size (e.g., "500ml bottle").',
  `item_sz` varchar(100) DEFAULT NULL COMMENT 'Item Size Description: Additional size descriptor used in packaging/logistics.',
  `ctn_qty` varchar(10) DEFAULT NULL COMMENT 'Carton Quantity Requested: Quantity requested expressed as number of cartons (string to preserve legacy formats).',
  `pcs_qty` varchar(100) DEFAULT NULL COMMENT 'Pieces Quantity Requested: Quantity requested in individual pieces (string for legacy formatting).',
  `adj_ctn_qty` int DEFAULT NULL COMMENT 'Adjusted Carton Quantity: Cartons approved after modification or verification (numeric).',
  `adj_pcs_qty` int DEFAULT NULL COMMENT 'Adjusted Pieces Quantity: Pieces approved after modification or verification (numeric).',
  `rcv_ctn_qty` int DEFAULT '0' COMMENT 'Received Cartons Actual: Number of cartons physically received at destination (defaults to 0).',
  `rcv_pcs_qty` int DEFAULT '0' COMMENT 'Received Pieces Actual: Number of individual pieces physically received (defaults to 0).',
  `status` int DEFAULT '1' COMMENT 'Line Item Status: Numeric flag indicating line state (1 = active/valid, 0 = inactive/cancelled).',
  `sell_ctn_qty` int DEFAULT '0' COMMENT 'Sellable Cartons Count: Cartons validated and eligible for sale after inspection (numeric).',
  `sell_pcs_qty` int DEFAULT '0' COMMENT 'Sellable Pieces Count: Pieces validated and eligible for sale after inspection (numeric).',
  PRIMARY KEY (`req_det_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; 

-- Table structure for table `detailed_inv_details`
DROP TABLE IF EXISTS `detailed_inv_details`;
CREATE TABLE `detailed_inv_details` (
  `rel_id` int NOT NULL AUTO_INCREMENT COMMENT 'Invoice Detail Relation ID: Primary key for each invoice line item record.',
  `id` int NOT NULL COMMENT 'Legacy ID: Source-system alternate id for mapping invoice lines to original data.',
  `inv_id` int NOT NULL COMMENT 'Invoice ID: Foreign key referencing the invoice this line belongs to (detailed_invoice.det_id or invoices table).',
  `product_id` int NOT NULL COMMENT 'Product ID: Internal numeric product identifier invoiced (references products.id).',
  `code` varchar(100) NOT NULL COMMENT 'Product SKU Code: SKU or product code string used across systems.',
  `name` varchar(255) NOT NULL COMMENT 'Product Name: Full display name of the product as shown on invoice and reports.',
  `category` int NOT NULL COMMENT 'Product Category ID: Numeric category id used for classification and analytics.',
  `product_cat_name` varchar(255) NOT NULL COMMENT 'Product Category Name: Text name of the category presented to users.',
  `root_category` int NOT NULL COMMENT 'Root Category ID: Numeric id for the top-level product category for rollups.',
  `root_category_name` varchar(255) NOT NULL COMMENT 'Root Category Name: Text name for the top-level category.',
  `vol` decimal(16,2) NOT NULL COMMENT 'Product Volume: Numeric volume/measurement in base unit appropriate for the product (e.g., liters).',
  `ctnsz` int NOT NULL COMMENT 'Pieces Per Carton: Integer count of individual pieces inside one carton (used for conversions).',
  `price_type` enum('MRP','TP','DP','SP') NOT NULL COMMENT 'Price Type: Identifies which price is used (MRP = retail, TP = trade, DP = distributor, SP = selling price).',
  `ctn_price` decimal(16,2) NOT NULL COMMENT 'Carton Price: Monetary price charged for one carton.',
  `pc_price` decimal(16,2) NOT NULL DEFAULT '0.00' COMMENT 'Piece Price: Monetary price charged for a single piece; 0.00 when not used.',
  `pqty_in_ctn` int NOT NULL COMMENT 'Pieces In Carton: Canonical number of pieces per carton (used to convert cartons <-> pieces).',
  `pqty_in_pcs` int NOT NULL DEFAULT '0' COMMENT 'Pieces Unit Quantity: Extra pieces invoiced outside full cartons (numeric).',
  `a_qty_ctn` int NOT NULL DEFAULT '0' COMMENT 'Adjusted Cartons Quantity: Cartons quantity after reconciliation or manual adjustments.',
  `a_qty_pcs` int NOT NULL COMMENT 'Adjusted Pieces Quantity: Pieces quantity after reconciliation or manual adjustments.',
  `compl_ctn` int NOT NULL DEFAULT '0' COMMENT 'Complimentary Cartons: Number of cartons given free as promotion (numeric).',
  `compl_pcs` int NOT NULL COMMENT 'Complimentary Pieces: Number of pieces given free as promotion (numeric).',
  `line_total` decimal(16,2) NOT NULL COMMENT 'Line Total Amount: Calculated total monetary value for this invoice line after discounts and adjustments.',
  `is_gift` int NOT NULL DEFAULT '0' COMMENT 'Gift Flag: Indicates promotional free items (1 = gift/offer line, 0 = regular charged line).',
  `order_id` int NOT NULL COMMENT 'Associated Order ID: Numeric id of order linked to this invoice line (for traceability).',
  `inserted_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record Timestamp: Time when this line was inserted or last updated (auto-managed).',
  `dlv_status` int NOT NULL DEFAULT '1' COMMENT 'Delivery Status Code: Numeric flag (1 = delivered, 0 = cancelled or undelivered).',
  `is_active` int NOT NULL DEFAULT '1' COMMENT 'Active Flag: 1 = line active and counted in totals, 0 = deactivated/archived.',
  PRIMARY KEY (`rel_id`),
  KEY `ord_id` (`inv_id`,`product_id`,`is_gift`),
  KEY `inv` (`inv_id`,`product_id`,`root_category`,`category`,`pqty_in_ctn`,`dlv_status`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=1815630 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;























-- Table structure for table `detailed_invoice`
DROP TABLE IF EXISTS `detailed_invoice`;
CREATE TABLE `detailed_invoice` (
  `det_id` int NOT NULL AUTO_INCREMENT COMMENT 'Invoice ID: Primary key. Unique numeric identifier for the detailed invoice record.',
  `id` int NOT NULL COMMENT 'Legacy ID: Alternate identifier originating from legacy/source system used for mapping.',
  `inv_date` date NOT NULL COMMENT 'Invoice Date: Date invoice was created (format YYYY-MM-DD).',
  `exp_delivery_date` date NOT NULL COMMENT 'Expected Delivery Date: Anticipated date for goods delivery (format YYYY-MM-DD).',
  `inv_number` varchar(50) NOT NULL COMMENT 'Invoice Number: External reference string used on printed invoices and integrations.',
  `demand_id` varchar(50) NOT NULL COMMENT 'Demand/Requisition ID: Identifier for related demand document or requisition.',
  `sales_ref_number` varchar(50) NOT NULL COMMENT 'Sales Reference Number: Sales team tracking reference used in internal processes.',
  `challan_number` varchar(50) NOT NULL COMMENT 'Challan Number: Delivery challan reference used for logistic handover.',
  `grand_tot` decimal(16,2) NOT NULL COMMENT 'Grand Total Amount: Total invoice monetary amount before payments and after line calculations.',
  `discount` decimal(16,2) NOT NULL COMMENT 'Total Discount Amount: Sum of discounts applied across invoice lines (monetary).',
  `cash_com` decimal(16,2) NOT NULL COMMENT 'Cash Commission Amount: Commission component paid in cash (monetary).',
  `dsr_com` decimal(16,2) NOT NULL COMMENT 'DSR Commission Amount: Commission allocated to delivery sales representatives (monetary).',
  `total_payable` decimal(16,2) NOT NULL COMMENT 'Total Payable Amount: Net amount due after discounts and commissions (monetary).',
  `total_paid` decimal(16,2) NOT NULL COMMENT 'Total Paid Amount: Monetary amount already paid against the invoice.',
  `created_by` int NOT NULL COMMENT 'Created By User ID: Numeric ID of user who created the invoice record (for audit).',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Created On Timestamp: Record creation or last modification time (auto-managed).',
  `is_active` int NOT NULL DEFAULT '1' COMMENT 'Active Flag: 1 = invoice active and counted, 0 = cancelled/deactivated.',
  `pay_status` enum('Canceled','Due','Paid','Settled') NOT NULL COMMENT 'Payment Status: Current payment lifecycle state for the invoice.',
  `dlv_status` enum('Delivered','Partially Delivered','Pending','Cancelled','Partially Cancelled') NOT NULL DEFAULT 'Delivered' COMMENT 'Delivery Status: Overall delivery state for the invoice items.',
  `route` int NOT NULL DEFAULT '0' COMMENT 'Route ID: Numeric identifier for delivery route used by logistics planning.',
  `outlet` int NOT NULL DEFAULT '-1' COMMENT 'Outlet/Store ID: Identifier of the outlet or customer location receiving goods.',
  `notes` longtext NOT NULL COMMENT 'Invoice Notes: Free-text field for remarks, exceptions, packing instructions, or audit notes.',
  `inv_ref_no` varchar(50) NOT NULL COMMENT 'Invoice Reference Number: External integration reference string used to link external systems.',
  `store_id` int NOT NULL COMMENT 'Store ID: Numeric id of store associated with invoice (for inventory allocation).',
  `order_id` varchar(50) NOT NULL COMMENT 'Order ID: String identifier of the order associated with this invoice (may be external format).',
  `order_number` varchar(50) NOT NULL COMMENT 'Order Number: Human-friendly order number displayed in UIs and reports.',
  `cancel_order` int NOT NULL DEFAULT '0' COMMENT 'Order Cancel Flag: 1 = linked order cancelled; 0 = not cancelled.',
  `req_id` int NOT NULL DEFAULT '0' COMMENT 'Store Request ID: Identifier of related store transfer/request when invoice ties to a transfer.',
  `cancel_invoice` int NOT NULL DEFAULT '0' COMMENT 'Invoice Cancel Flag: 1 = invoice cancelled; 0 = active.',
  `region_id` int DEFAULT NULL COMMENT 'Region ID: Numeric region identifier used for reporting and allocation.',
  `region_name` varchar(255) DEFAULT NULL COMMENT 'Region Name: Text name for the region used in displays and reports.',
  `depot_id` int DEFAULT NULL COMMENT 'Depot ID: Numeric identifier for depot used in inventory management.',
  `depot_name` varchar(255) DEFAULT NULL COMMENT 'Depot Name: Text name of depot for readability in UIs.',
  `area_id` int DEFAULT NULL COMMENT 'Area ID: Numeric area identifier for delivery mapping.',
  `area_name` varchar(255) DEFAULT NULL COMMENT 'Area Name: Text name for area used in addresses and reporting.',
  `territory_id` int DEFAULT NULL COMMENT 'Territory ID: Numeric territory identifier for sales/logistics reporting.',
  `territory_name` varchar(255) DEFAULT NULL COMMENT 'Territory Name: Text name of the territory for display and reporting.',
  `distri_id` int NOT NULL COMMENT 'Distributor ID: Numeric identifier of the distributor associated with this invoice.',
  `distri_name` varchar(255) DEFAULT NULL COMMENT 'Distributor Name: Text name of distributor used on reports and invoice displays.',
  `distri_code` varchar(255) DEFAULT NULL COMMENT 'Distributor Code: System code used to uniquely reference the distributor.',
  `d_identity` varchar(50) DEFAULT NULL COMMENT 'Distributor Identity: Secondary cross-system identifier used for integrations/matching.',
  `month` int DEFAULT '0' COMMENT 'Reporting Month Number: Month number used for monthly aggregation (1-12), 0 if unspecified.',
  `additional_address` text COMMENT 'Additional Address Details: Free-text field for extra delivery/billing address information.',
  `special_permission` tinyint NOT NULL DEFAULT '0' COMMENT 'Special Permission Flag: 0 = no special permission required; 1 = special permission required for processing.',
  PRIMARY KEY (`det_id`),
  KEY `d_identity` (`d_identity`),
  KEY `grand_tot` (`grand_tot`),
  KEY `pay_status` (`pay_status`),
  KEY `territory_id` (`territory_id`),
  KEY `region_name` (`region_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=192396 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Table structure for table `detailed_order`
DROP TABLE IF EXISTS `detailed_order`;
CREATE TABLE `detailed_order` (
  `rel_id` int NOT NULL AUTO_INCREMENT COMMENT 'Order ID: Primary key. Unique numeric identifier for the detailed order record.',
  `id` int NOT NULL COMMENT 'Legacy ID: Alternate identifier from the source system for mapping and reconciliation.',
  `ord_date` date NOT NULL COMMENT 'Order Date: Date order was placed (YYYY-MM-DD).',
  `exp_delivery_date` varchar(50) NOT NULL COMMENT 'Expected Delivery Date (string): Anticipated delivery date stored as legacy string for compatibility.',
  `ord_number` varchar(50) NOT NULL COMMENT 'Order Number: External reference string for the order used by sales or ERP.',
  `distri_id` int NOT NULL COMMENT 'Distributor ID: Numeric identifier for the distributor responsible for the order.',
  `distri_code` varchar(50) NOT NULL COMMENT 'Distributor Code: Short code used to identify the distributor in systems.',
  `distri_name` varchar(255) NOT NULL COMMENT 'Distributor Name: Full name of the distributor for UI and reports.',
  `d_identity` varchar(50) NOT NULL COMMENT 'Distributor Identity: Cross-system integration identifier string used for matching.',
  `grand_tot` decimal(16,2) NOT NULL COMMENT 'Grand Total: Total monetary value of the order before payments and after discounts.',
  `discount` decimal(16,2) NOT NULL COMMENT 'Discount: Total discount amount applied to the order (monetary).',
  `cash_com` decimal(16,2) NOT NULL COMMENT 'Cash Commission: Commission amount payable in cash as part of the order settlement.',
  `dsr_com` decimal(16,2) NOT NULL COMMENT 'DSR Commission: Commission assigned to delivery sales representative (monetary).',
  `total_payable` decimal(16,2) NOT NULL COMMENT 'Total Payable: Net amount that should be paid after discounts and commissions.',
  `total_paid` decimal(16,2) NOT NULL COMMENT 'Total Paid: Amount already paid against the order (monetary).',
  `created_by` int NOT NULL COMMENT 'Created By User ID: Numeric id of user who created this order (audit).',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Created On Timestamp: When the order record was created or last modified (auto-managed).',
  `is_active` int NOT NULL DEFAULT '1' COMMENT 'Active Flag: 1 indicates order is active; 0 indicates cancelled/inactive.',
  `pay_status` enum('Canceled','Due','Paid','Settled') NOT NULL COMMENT 'Payment Status: Current payment lifecycle state for order (Canceled/Due/Paid/Settled).',
  `dlv_status` enum('Delivered','Partially Delivered','Pending','Cancelled','Partially Cancelled') NOT NULL DEFAULT 'Pending' COMMENT 'Delivery Status: Order delivery state for downstream systems.',
  `route` int NOT NULL DEFAULT '0' COMMENT 'Route ID: Identifier of delivery route assigned to the order for logistics planning.',
  `outlet` int NOT NULL DEFAULT '-1' COMMENT 'Outlet/Store ID: Identifier of receiving outlet or customer location.',
  `notes` longtext COMMENT 'Order Notes: Free-text instructions, special handling or internal comments relevant to this order.',
  `inv_ref` varchar(50) DEFAULT NULL COMMENT 'Invoice Reference: External invoice reference if an invoice has been created.',
  `req_id` int NOT NULL COMMENT 'Store Request ID: Identifier linking this order to a store transfer/request when applicable.',
  `region_id` varchar(255) DEFAULT '0' COMMENT 'Region ID (string): Region identifier used in reporting (string form for legacy compatibility).',
  `region_name` varchar(255) DEFAULT NULL COMMENT 'Region Name: Name of the region used on displays and reports.',
  `depot_id` varchar(255) DEFAULT '0' COMMENT 'Depot ID (string): Depot identifier used for routing/inventory (string legacy format).',
  `depot_name` varchar(255) DEFAULT NULL COMMENT 'Depot Name: Depot textual label for readability.',
  `area_id` int DEFAULT '0' COMMENT 'Area ID: Numeric area identifier used for mapping deliveries.',
  `area_name` varchar(255) DEFAULT NULL COMMENT 'Area Name: Text name of the delivery area.',
  `territory_id` int DEFAULT '0' COMMENT 'Territory ID: Numeric territory identifier used in sales reporting.',
  `territory_name` varchar(255) DEFAULT NULL COMMENT 'Territory Name: Text name for the territory.',
  `month` int DEFAULT '0' COMMENT 'Reporting Month Number: Month used for financial or sales aggregation (1-12), 0 if unspecified.',
  `valid_till` date DEFAULT '0000-00-00' COMMENT 'Order Valid Till: Expiry date for order validity (YYYY-MM-DD).',
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









-- Table structure for table `detailed_order_details`
DROP TABLE IF EXISTS `detailed_order_details`;
CREATE TABLE `detailed_order_details` (
  `rel_id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Order Detail ID: Primary key for order line items; unique per invoice/order detail row.',
  `id` int NOT NULL DEFAULT '0' COMMENT 'Legacy ID: Alternate mapping id from source system for this specific line.',
  `ord_id` int NOT NULL COMMENT 'Order ID: Foreign key linking to detailed_order.rel_id (which order this line belongs to).',
  `product_id` int NOT NULL COMMENT 'Product ID: Numeric id of product included on this order line.',
  `code` varchar(10) DEFAULT NULL COMMENT 'Product Code (SKU): Short SKU code used to identify product quickly.',
  `name` varchar(100) DEFAULT NULL COMMENT 'Product Name: Display name of the product used on the order and reports.',
  `category` int DEFAULT NULL COMMENT 'Category ID: Numeric id of product category used for classification.',
  `product_cat_name` varchar(30) DEFAULT NULL COMMENT 'Product Category Name: Name of the product category for display.',
  `root_category` int DEFAULT NULL COMMENT 'Root Category ID: Numeric identifier for broad/top-level classification.',
  `root_category_name` varchar(30) DEFAULT NULL COMMENT 'Root Category Name: Name of top-level classification used in rollups.',
  `vol` decimal(16,2) NOT NULL COMMENT 'Product Volume: Numeric volume or measurement value in base units (e.g., ml, L).',
  `ctnsz` int NOT NULL COMMENT 'Carton Size (Pieces): Number of individual units included in one carton.',
  `price_type` enum('MRP','TP','DP','SP') NOT NULL COMMENT 'Price Type: Type of price applied to the line (MRP, Trade Price, Distributor Price, Selling Price).',
  `ctn_price` decimal(16,2) NOT NULL COMMENT 'Carton Price: Monetary price applied per carton for this item.',
  `pc_price` decimal(16,2) NOT NULL DEFAULT '0.00' COMMENT 'Piece Price: Monetary price applied per single piece, if used.',
  `pqty_in_ctn` int NOT NULL COMMENT 'Pieces Per Carton: Canonical piece count used to convert between cartons and pieces.',
  `pqty_in_pcs` int NOT NULL DEFAULT '0' COMMENT 'Pieces Quantity (units): Number of individual pieces invoiced on this line.',
  `a_qty_ctn` int NOT NULL DEFAULT '0' COMMENT 'Adjusted Cartons Quantity: Carton quantity after manual adjustments or reconciliations.',
  `a_qty_pcs` int NOT NULL COMMENT 'Adjusted Pieces Quantity: Pieces quantity after adjustments or reconciliations.',
  `compl_ctn` int NOT NULL DEFAULT '0' COMMENT 'Complimentary Cartons: Count of free cartons included in the order (promotion).',
  `compl_pcs` int NOT NULL COMMENT 'Complimentary Pieces: Count of free pieces included in the order (promotion).',
  `line_total` decimal(16,2) NOT NULL COMMENT 'Line Total: Monetary total for this order line after price * quantity and any discounts.',
  `is_gift` int NOT NULL DEFAULT '0' COMMENT 'Gift Flag: 1 indicates this line is a promotional gift/offer; 0 indicates standard sale line.',
  `is_active` int NOT NULL DEFAULT '1' COMMENT 'Active Flag: 1 indicates the order line is active; 0 indicates it is deactivated or removed.',
  `inv_id` int NOT NULL DEFAULT '0' COMMENT 'Invoice ID: Identifier of invoice if this order line has been invoiced (link to invoices).',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created On Timestamp: When this order line was first created (auto-set).',
  `ofr_id` int DEFAULT '0' COMMENT 'Offer ID: Identifier for promotional offer applied to this line, if any.',
  PRIMARY KEY (`rel_id`,`id`),
  KEY `ord_id` (`ord_id`),
  KEY `product_id` (`product_id`),
  KEY `category` (`category`),
  KEY `is_gift` (`is_gift`)
) ENGINE=InnoDB AUTO_INCREMENT=1316960 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;






















-- Table structure for table `productcategories`
DROP TABLE IF EXISTS `productcategories`;
CREATE TABLE `productcategories` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Category ID: Primary key. Unique numeric identifier for a product category.',
  `name` varchar(30) NOT NULL COMMENT 'Category Name: Display name for the category used in UI and reports.',
  `sub_of` int NOT NULL COMMENT 'Parent Category ID: Numeric id of parent category; 0 indicates this category is a top-level/root category.',
  `created_by` int NOT NULL COMMENT 'Created By User ID: Numeric id of user who initially created this category record.',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created On Timestamp: When the category record was created (auto-managed).',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Active Flag: 1 = category is active and selectable; 0 = category is disabled/archived.',
  `org_id` int NOT NULL DEFAULT '0' COMMENT 'Organization ID: Numeric id used in multi-tenant setups to scope categories to an organization.',
  PRIMARY KEY (`id`),
  KEY `sub_of` (`sub_of`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;

















-- Table structure for table `products`
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Product ID: Primary key. Internal numeric identifier for each product record.',
  `unique_id` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'External Product Identifier (SKU): Unique external id or SKU used for integrations (example format "SKU-12345").',
  `code` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'Product Code (Short SKU): Short code used for quick lookups and labels.',
  `name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'Product Name (English): Product name in Latin script for catalogs and reports.',
  `name_bangla` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Product Name (Bangla): Local language product name used for local UIs/labels.',
  `category` int NOT NULL COMMENT 'Product Category ID: Numeric id linking to productcategories.id for classification.',
  `flavor` int NOT NULL COMMENT 'Flavor ID/Code: Numeric identifier for flavor variant or sub-variant (lookup table expected).',
  `size_in_ml` decimal(10,2) NOT NULL COMMENT 'Product Size (ml): Numeric volume in milliliters used for packaging and conversion (example 500.00).',
  `ctn_size_in_pcs` int NOT NULL COMMENT 'Carton Size (Pieces): Integer number of pieces contained within one carton.',
  `created_by` int NOT NULL COMMENT 'Created By User ID: Numeric id of user who created this product entry (audit).',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created On Timestamp: When the product record was created (auto-managed).',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Active Flag: 1 = product is active and available for sale; 0 = product is inactive/archived.',
  `image` text CHARACTER SET latin1 COLLATE latin1_swedish_ci COMMENT 'Product Image Reference: URL or textual reference pointing to product image or binary storage id.',
  `old_new_status` int NOT NULL DEFAULT '1' COMMENT 'Product Lifecycle Status: 0 = legacy/old listing; 1 = current/new listing (affects display/priority).',
  PRIMARY KEY (`id`),
  KEY `size_in_ml` (`size_in_ml`,`ctn_size_in_pcs`),
  KEY `category` (`category`),
  KEY `idx_products_active` (`id`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
