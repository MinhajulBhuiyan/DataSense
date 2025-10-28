"""
Database Connection Handler
Manages MySQL database connections with automatic SSH tunnel support
"""

import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseConnector:
    """Handle database connections and query execution with SSH tunnel"""
    
    def __init__(self):
        """Initialize database configuration from environment variables"""        
        # Database Configuration
        self.db_host = os.getenv("DB_HOST")
        self.db_port = int(os.getenv("DB_PORT", 3306))
        self.db_user = os.getenv("DB_USER")
        self.db_password = os.getenv("DB_PASSWORD")
        self.database = os.getenv("DB_NAME")

    
    def connect(self):
        """Establish connection to MySQL database"""
        try:
            self.connection = pymysql.connect(
                host=self.db_host,
                port=self.db_port,
                user=self.db_user,
                password=self.db_password,
                database=self.database,
                connect_timeout=10
            )
            if self.connection.open:
                return True, "Connected successfully"
            else:
                return False, "Connection failed"
        except Exception as e:
            return False, f"Connection error: {str(e)}"
    
    def execute_query(self, query):
        """
        Execute a SQL query and return results
        
        Args:
            query (str): SQL query to execute
            
        Returns:
            tuple: (success (bool), data (list), columns (list))
        """
        try:
            if not self.connection or not self.connection.open:
                success, message = self.connect()
                if not success:
                    return False, message, None
            
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                
                if query.strip().lower().startswith("select"):
                    data = cursor.fetchall()
                    columns = [desc[0] for desc in cursor.description]
                    return True, data, columns
                else:
                    self.connection.commit()
                    return True, f"{cursor.rowcount} row(s) affected.", None
        except Exception as e:
            return False, str(e), None
    
    def test_connection(self):
        """Test database connection"""
        return self.connect()
    
    def close(self):
        """Close database connection"""
        if self.connection and self.connection.open:
            self.connection.close()
