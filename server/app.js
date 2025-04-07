const path = require("path");
const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const helmet = require("helmet");
const session = require("express-session");

const router = require("./router.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || "mongodb://localhost/DomoMaker";
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log("couldn't connect to the server");
  }
});

const app = express();
app.use(helmet());
app.use("/assets", express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session management
app.use(
  session({
    key: "sessionId",
    secret: "Domo Arigato",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "" }));
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server is listening on port ${port}`);
});
