"""
Query Executor
Handles query execution and result formatting
"""

from tabulate import tabulate
from db_connector import DatabaseConnector
from query_validator import QueryValidator

class QueryExecutor:
    """Execute queries and format results"""
    
    def __init__(self):
        """Initialize database connector and validator"""
        self.db = DatabaseConnector()
        self.validator = QueryValidator()
    
    def execute_with_validation(self, query):
        """
        Validate and execute query, return formatted results
        
        Args:
            query (str): SQL query to execute
            
        Returns:
            str: Formatted results or error message
        """
        # Clean the query
        query = self.validator.clean_query(query)
        
        # Validate query safety
        is_safe, safety_message = self.validator.is_safe_query(query)
        
        if not is_safe:
            return safety_message
        
        # Execute query
        success, data, columns = self.db.execute_query(query)
        
        if not success:
            return f"❌ Execution Error: {data}"
        
        # Format and return results
        if columns:
            # SELECT query with results
            if len(data) == 0:
                return "✅ Query executed successfully.\n📊 No results found."
            
            # Format as table
            table = tabulate(data, headers=columns, tablefmt='grid')
            row_count = len(data)
            return f"✅ Query executed successfully.\n\n{table}\n\n📊 {row_count} row(s) returned."
        else:
            # Non-SELECT query
            return f"✅ {data}"
    
    def test_connection(self):
        """Test database connection"""
        success, message = self.db.test_connection()
        if success:
            return "✅ Database connection successful!"
        else:
            return f"❌ Database connection failed: {message}"
    
    def close(self):
        """Close database connection"""
        self.db.close()
