const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongodb = require("./config/connection");
const apiRoutes = require("./routes/api_routes");

const app = express();
require("dotenv").config();

const port = process.env.PORT || 3005;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
mongodb();
app.get("/", (req, res) => {
  res.send("Welcome to backend server");
});

app.use("/api", apiRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));