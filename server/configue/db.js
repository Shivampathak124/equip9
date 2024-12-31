const Sequelize = require("sequelize");
const dotenv = require("dotenv");


dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE, // Database Name
  process.env.DB_USER, // Username
  process.env.DB_PASSWORD, // Password
  {
    host: process.env.DB_HOST, // XAMPP Host (localhost or 127.0.0.1)
    port: process.env.DB_PORT, // MySQL Port
    dialect: "mysql", // Database Dialect
    logging: false, 
  }
);


sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to XAMPP MySQL database successfully!");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
