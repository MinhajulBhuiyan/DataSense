"""
Load and format business context from datasense.md
"""

def load_business_context():
    """Load the DataSense business context from markdown file"""
    try:
        with open('datasense.md', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract key business information for the prompt
        business_summary = """
DATASENSE BUSINESS CONTEXT:

Company: Ice cream manufacturing company with distribution operations
Core Business: Sales to registered distributors

KEY BUSINESS RULES:
1. Orders are placed by distributors for products
2. Invoices are generated from orders (one order per invoice)
3. Stock is deducted when invoices are created (sale_deduct)
4. Stock is added back on returns (return_add) or cancellations (cancellation_add)
5. Deliveries can be partial or full (tracked in invoice_items)
6. Returns are handled separately - original records are immutable
7. Refunds are issued for returns, cancellations, or overpayments
8. Payments track money received from distributors
9. Load plans organize deliveries by vehicle
10. Challans and gate passes are auto-generated delivery documents

ORDER TO INVOICE FLOW:
placed → invoiced → fully_delivered (or partial_delivered/cancelled)

INVOICE STATUS FLOW:
invoiced → partial_delivered → fully_delivered → (returned/cancelled)

RETURN STATUS FLOW:
pending → processed

REFUND STATUS FLOW:
pending → issued → processed

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

COMMON BUSINESS SCENARIOS:
1. Calculate net revenue for a distributor
2. Track stock movements and current levels
3. Identify partially delivered invoices
4. Monitor pending returns and refunds
5. Analyze payment status (paid/unpaid/partial)
6. Vehicle utilization and load planning
7. Return rate analysis by product/distributor
8. Inventory turnover and stock alerts
"""
        
        return business_summary
    except FileNotFoundError:
        return "Business context file not found."

BUSINESS_CONTEXT = load_business_context()
