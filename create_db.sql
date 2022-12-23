/*Code for creating the database*/
CREATE DATABASE myRecipeList;
USE myRecipeList;
CREATE TABLE recipes (id INT AUTO_INCREMENT, recipe_name VARCHAR(50), values_per DECIMAL(5) unsigned, unit VARCHAR(10),
carbs DECIMAL(5) unsigned,fat DECIMAL(5, 2) unsigned, protein DECIMAL(5, 2) unsigned,  
salt DECIMAL(5, 2) unsigned, sugar DECIMAL(5,2) unsigned, PRIMARY KEY(id));
CREATE TABLE users (username VARCHAR(50), firstname VARCHAR(50), lastname VARCHAR(50),email VARCHAR(50), hashedPassword VARCHAR(255));
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myRecipeList.* TO 'appuser'@'localhost';  
