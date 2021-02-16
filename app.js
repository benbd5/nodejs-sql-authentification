const express = require("express"),
  app = express(),
  port = 3000,
  util = require("util"),
  session = require("express-session"),
  flash = require("connect-flash"),
  mysql = require("mysql");

// Dotenv
require("dotenv").config();

// EJS
app.set("view engine", "ejs");

// Static folder
app.use(express.static("public"));

// Middleware - BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PSWD,
  database: process.env.DB,
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Variable globale pour mysql : util.promisify de node.js lié avec .bind()
global.query = util.promisify(connection.query).bind(connection);

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false, // force à ce qu'une nouvelle session soit crée
    saveUninitialized: true, // force à ce qu'une nouvelle session soit enregistrée
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // le cookie dure 24h
    },
  })
);

// Messages flash
app.use(flash());

// Middleware authentification
const verifyAuth = require("./middlewares/verifyAuth");

// Routes
const index = require("./routes/indexRoute");
const auth = require("./routes/authRoute");
const dashboard = require("./routes/dashboardRoute");

app.use("/", index);
app.use("/auth", auth);
app.use("/dashboard", verifyAuth.get_verify_auth, dashboard);

app.get("*", function (req, res) {
  res.render("404");
});

// Listen
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port: ${port}`);
});
