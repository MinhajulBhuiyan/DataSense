"""
Database Connection Handler
Manages direct MySQL database connections and query execution.
"""

import pymysql
import pymysql.cursors
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseConnector:
    """Direct MySQL connection handler.

    Provides connection management and query execution helpers. Reads DB
    configuration from environment variables: DB_HOST, DB_PORT, DB_USER,
    DB_PASSWORD and DB_NAME.
    """

    def __init__(self):
        """Initialize database configuration from environment variables"""
        # Database Configuration
        self.db_host = os.getenv("DB_HOST")
        self.db_port = int(os.getenv("DB_PORT", 3306))
        self.db_user = os.getenv("DB_USER")
        self.db_password = os.getenv("DB_PASSWORD")
        self.database = os.getenv("DB_NAME")

        # Connection handle (None until connected)
        self.connection = None

    
    def connect(self):
        """Establish connection to MySQL database"""
        try:
            # Basic validation of required config
            if not all([self.db_host, self.db_user, self.db_password, self.database]):
                return False, "Missing DB config (DB_HOST/DB_USER/DB_PASSWORD/DB_NAME)"

            self.connection = pymysql.connect(
                host=self.db_host,
                port=self.db_port,
                user=self.db_user,
                password=self.db_password,
                database=self.database,
                connect_timeout=10,
            )

            # Ensure connection is alive
            try:
                self.connection.ping(reconnect=True)
            except Exception:
                # if ping fails treat as a connection failure
                return False, "Connection failed after ping"

            return True, "Connected successfully"
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
            # Ensure we have a live connection. Use ping with reconnect to revive if needed.
            if self.connection is None:
                success, message = self.connect()
                if not success:
                    return False, message, None
            else:
                try:
                    self.connection.ping(reconnect=True)
                except Exception:
                    success, message = self.connect()
                    if not success:
                        return False, message, None

            with self.connection.cursor() as cursor:
                cursor.execute(query)

                if query.strip().lower().startswith("select"):
                    data = cursor.fetchall()
                    columns = [desc[0] for desc in cursor.description] if cursor.description else []
                    return True, data, columns
                else:
                    self.connection.commit()
                    return True, f"{cursor.rowcount} row(s) affected.", None
        except Exception as e:
            return False, str(e), None

    def execute_query_with_limit(self, query: str, limit: int):
        """
        Execute the provided query but only return up to `limit` rows.
        Uses a derived-table wrapper to safely apply a LIMIT without modifying
        the original query text.

        Returns: (success: bool, rows: list, columns: list)
        """
        try:
            if self.connection is None:
                success, message = self.connect()
                if not success:
                    return False, message, None
            else:
                try:
                    self.connection.ping(reconnect=True)
                except Exception:
                    success, message = self.connect()
                    if not success:
                        return False, message, None

            wrapper = f"SELECT * FROM ({query.strip().rstrip(';')}) AS _sub LIMIT {int(limit)}"
            with self.connection.cursor() as cursor:
                cursor.execute(wrapper)
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description] if cursor.description else []
                return True, rows, columns
        except Exception as e:
            return False, str(e), None

    def stream_query_with_columns(self, query: str, batch_size: int = 1000):
        """
        Stream rows for a query using a server-side cursor to avoid loading
        the entire resultset into memory. Returns a tuple (columns, generator)
        where generator yields row tuples.
        """
        # Ensure connection
        if self.connection is None:
            success, message = self.connect()
            if not success:
                raise RuntimeError(f"DB connect failed: {message}")
        else:
            try:
                self.connection.ping(reconnect=True)
            except Exception:
                success, message = self.connect()
                if not success:
                    raise RuntimeError(f"DB connect failed: {message}")

        # Use SSCursor for server-side iteration
        cursor = self.connection.cursor(pymysql.cursors.SSCursor)
        try:
            cursor.execute(query)
            columns = [desc[0] for desc in cursor.description] if cursor.description else []

            def generator():
                try:
                    while True:
                        rows = cursor.fetchmany(batch_size)
                        if not rows:
                            break
                        for r in rows:
                            yield r
                finally:
                    try:
                        cursor.close()
                    except Exception:
                        pass

            return columns, generator()
        except Exception:
            try:
                cursor.close()
            except Exception:
                pass
            raise
    
    def test_connection(self):
        """Test database connection.

        Returns:
            tuple(bool, str): (success, message)
        """
        return self.connect()
    
    def close(self):
        """Close database connection"""
        if getattr(self, 'connection', None):
            try:
                self.connection.close()
            except Exception:
                pass
            finally:
                self.connection = None
