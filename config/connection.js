const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.MONGODB_URL;
const conn = () => {
  mongoose
    .connect(db, {
      dbName: "DB_NAME", // Your database name
    })
    .then(() => {
      console.log("MongoDB Connnected...");
    })
    .catch((err) => {
      console.log("Error while Mongo Conn..", err);
    });
};

module.exports = conn;