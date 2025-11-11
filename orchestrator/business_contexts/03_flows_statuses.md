Order, Invoice, Return & Refund Flows
====================================

ORDER TO INVOICE FLOW:
placed → invoiced → fully_delivered (or partial_delivered/cancelled)

INVOICE STATUS FLOW:
invoiced → partial_delivered → fully_delivered → (returned/cancelled)

RETURN STATUS FLOW:
pending → processed

REFUND STATUS FLOW:
pending → issued → processed

These flow rules are important when generating queries that reference
status fields or when the user asks about staged states (e.g., partially
delivered invoices, pending returns).
