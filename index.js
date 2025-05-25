// index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Fiattib backend is live!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
