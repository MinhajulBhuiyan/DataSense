import mysql.connector

mydb = mysql.connector.connect(
  host="10.101.13.28",
  user="udatasense",
  password="u76*Fg345xjYG",
  port="3306",
)

print(mydb)