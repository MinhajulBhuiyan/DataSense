Key Business Rules
==================

1. Orders are placed by distributors for products.
2. Invoices are generated from orders (one order per invoice).
3. Stock is deducted when invoices are created (sale_deduct).
4. Stock is added back on returns (return_add) or cancellations (cancellation_add).
5. Deliveries can be partial or full (tracked in invoice_items).
6. Returns are handled separately - original records are immutable.
7. Refunds are issued for returns, cancellations, or overpayments.
8. Payments track money received from distributors.
9. Load plans organize deliveries by vehicle.
10. Challans and gate passes are auto-generated delivery documents.

These rules are authoritative for assembling prompts and for validating
the semantics of generated SQL (for example, revenue and outstanding
payment calculations).
