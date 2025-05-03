const express = require("express");
const app = express();

//middleware
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/new", (req, res) => {
  res.json({ message: "Hello from the new route!" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
);
