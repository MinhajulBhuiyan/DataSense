"""
Query Validator
Validates SQL queries before execution for safety
"""

import re

class QueryValidator:
    """Validate SQL queries for safety and correctness"""
    
    # Allowed SQL keywords for read-only operations
    ALLOWED_KEYWORDS = ['SELECT', 'SHOW', 'DESCRIBE', 'DESC', 'EXPLAIN']
    
    # Dangerous keywords that modify data
    DANGEROUS_KEYWORDS = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE']
    
    @staticmethod
    def is_select_query(query):
        """Check if query is a SELECT statement"""
        query_upper = query.strip().upper()
        return query_upper.startswith('SELECT')
    
    @staticmethod
    def is_safe_query(query):
        """
        Check if query is safe to execute (read-only)
        
        Args:
            query (str): SQL query to validate
            
        Returns:
            tuple: (is_safe, message)
        """
        query_upper = query.strip().upper()
        
        # Check for dangerous keywords
        for keyword in QueryValidator.DANGEROUS_KEYWORDS:
            if keyword in query_upper:
                return False, f"❌ Query contains dangerous keyword: {keyword}. Only SELECT queries are allowed."
        
        # Check if it starts with allowed keywords
        starts_with_allowed = any(query_upper.startswith(kw) for kw in QueryValidator.ALLOWED_KEYWORDS)
        
        if not starts_with_allowed:
            return False, "❌ Only SELECT, SHOW, DESCRIBE queries are allowed."
        
        # Basic check for SQL injection patterns
        dangerous_patterns = [
            r';\s*DROP',
            r';\s*DELETE',
            r';\s*INSERT',
            r';\s*UPDATE',
            r'--',  # SQL comments
            r'/\*.*\*/',  # Multi-line comments
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, query_upper):
                return False, "❌ Query contains potentially dangerous patterns."
        
        return True, "✅ Query is safe to execute."
    
    @staticmethod
    def clean_query(query):
        """Clean and format SQL query"""
        # Remove extra whitespace
        query = re.sub(r'\s+', ' ', query.strip())
        
        # Remove markdown code blocks if present
        if query.startswith('```'):
            lines = query.split('\n')
            query = '\n'.join([line for line in lines if not line.startswith('```')])
            query = query.strip()
        
        # Remove trailing semicolons (will be added back if needed)
        query = query.rstrip(';')
        
        return query
