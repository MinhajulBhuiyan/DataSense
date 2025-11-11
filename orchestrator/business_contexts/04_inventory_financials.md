Inventory Transaction Types & Financial Concepts
===============================================

INVENTORY TRANSACTION TYPES:
- production_add: New stock manufactured
- sale_deduct: Stock reduced for sales/invoicing
- return_add: Stock returned from customers
- cancellation_add: Stock restored from cancelled orders

FINANCIAL CONCEPTS:
- total_amount: Total invoice value
- delivered_amount: Actual value delivered (≤ total_amount)
- Net Revenue = total_amount - returned_amount
- Outstanding Payment = total_amount - sum(payments)

Include these definitions when the user asks financial or inventory
questions so the model uses the correct fields and calculations.
