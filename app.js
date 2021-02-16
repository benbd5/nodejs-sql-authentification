const express = require("express"),
  app = express(),
  port = 3000;

// EJS
app.set("view engine", "ejs");

// Static folder
app.use(express.static("public"));

// Middleware - BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const index = require("./routes/indexRoute");
const auth = require("./routes/authRoute");

app.use("/", index);
app.use("/auth", auth);

app.get("*", function (req, res) {
  res.render("404");
});

// Listen
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port: ${port}`);
});
