# Demo Natural Language Queries for NL to SQL - DataSense Database

## Distributor Queries

1. Show me all active distributors
2. Get all distributors registered in 2024
3. Find distributors with pending orders
4. List all distributor contact information
5. Show inactive distributors

## Product Queries

6. Get all products with price greater than 5 dollars
7. Find products that are out of stock (stock = 0)
8. Show me all active ice cream products
9. List products with stock less than 100 units
10. Get the most expensive products

## Order Queries

11. Show me all placed orders
12. Find orders with status cancelled
13. Get all orders from a specific distributor
14. List orders placed in the last 7 days
15. Show orders with total amount greater than 1000

## Invoice Queries

16. Get all invoices with status fully delivered
17. Find invoices that are partially delivered
18. Show invoices for a specific order
19. List invoices created in the last month
20. Get invoices where delivered amount is less than total amount

## Sales Returns

21. Show all pending sales returns
22. Find processed returns from the last week
23. Get total returned amount by invoice
24. List all return items with quantity greater than 10
25. Show sales returns with reason "Damaged"

## Payment Queries

26. Get all payments made by cash
27. Find payments made in the last 30 days
28. Show total payment amount by invoice
29. List all invoices with outstanding balance
30. Get payment history for a specific distributor

## Refund Queries

31. List all pending refunds
32. Get refunds issued by credit note method
33. Show total refund amount for each invoice
34. Find processed refunds from last month
35. Get refund reasons grouped by type

## Inventory Queries

36. Show all inventory transactions for a specific product
37. Find production additions in the last month
38. Get all sale deductions from inventory
39. List inventory transactions with return additions
40. Show current stock levels for all products

## Vehicle and Load Plan Queries

41. Get all active vehicles
42. Show vehicles with capacity greater than 3000
43. Find load plans created today
44. List all load plan items for a specific vehicle
45. Get completed load plans with their challans

## Business Intelligence Queries

46. Calculate net revenue for each distributor (total - returns)
47. Show products with the highest sales quantity
48. Find distributors with more than 5 orders
49. List invoices with their order and distributor details
50. Show products that have never been ordered
51. Get total payments received per invoice
52. Find orders that have not been invoiced yet
53. Show invoices with outstanding balance (total - payments)
54. Calculate return rate by product
55. Get inventory turnover for each product

## Financial Analysis

56. Show total revenue by month
57. Calculate outstanding payments by distributor
58. Find invoices with partial payments
59. Get refund amount vs invoice amount ratio
60. Show payment method distribution

## Operational Queries

61. List vehicles with their current load plans
62. Find invoices waiting for delivery
63. Show distributors with highest order frequency
64. Get average delivery time by vehicle
65. Find products with frequent returns

---

## Usage Examples

### Example 1: Basic Query
**Input:** Show me all active distributors  
**Expected Output:** `SELECT * FROM distributors WHERE is_active = TRUE;`

### Example 2: Join Query
**Input:** Get all orders from a specific distributor  
**Expected Output:** `SELECT o.* FROM orders o JOIN distributors d ON o.distributor_id = d.distributor_id WHERE d.name = 'DistribCo North';`

### Example 3: Financial Calculation
**Input:** Calculate net revenue for each distributor  
**Expected Output:** 
```sql
SELECT d.name, 
       SUM(i.total_amount) - COALESCE(SUM(sr.total_returned_amount), 0) as net_revenue
FROM distributors d
LEFT JOIN orders o ON d.distributor_id = o.distributor_id
LEFT JOIN invoices i ON o.order_id = i.order_id
LEFT JOIN sales_returns sr ON i.invoice_id = sr.invoice_id
GROUP BY d.distributor_id, d.name;
```

### Example 4: Stock Management
**Input:** Find products with low stock  
**Expected Output:** `SELECT * FROM products WHERE current_stock < 100 AND is_active = TRUE;`

### Example 5: Business Flow
**Input:** Show invoices that are partially delivered  
**Expected Output:** `SELECT * FROM invoices WHERE status = 'partial_delivered';`

---

## How to Use

1. Run the script:
   ```bash
   python nl_to_sql.py
   ```

2. Type or paste any natural language query from above

3. Review the generated SQL query

4. Choose to execute or skip

5. View results in formatted table

6. Type 'exit' to quit

---

## Notes

- All queries are generated based on the **datasense** database schema
- The LLM understands business context (orders→invoices, stock management, returns)
- Financial calculations follow business rules (net revenue, outstanding payments)
- Queries respect business flows (status progressions, immutability)
- Only SELECT queries are executed (read-only for safety)
- All queries rely on the llama3:8b model with business context training


