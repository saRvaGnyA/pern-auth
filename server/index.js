const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json()); // to access req.body

// ROUTES

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard routes
app.use("/dashboard", require("./routes/dashboard"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
