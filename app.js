const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");
const words = require("./db/words.json");

const server = express();

// console.log(words);
// console.log(typeof words);

server.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout.hbs",
    partialsDir: "partials",
  })
);
server.set("view engine", "hbs");
server.use(express.static(__dirname + "/public"));
server.use(bodyParser.urlencoded({ extended: false }));
server.get("/", (req, res) => {
  res.render("home", {
    words,
  });
});
server.post("/", (req, res) => {
  const { query } = req.body;
  console.log(query.toLowerCase());
  res.render("home", {
    // words: words.filter(
    //   (w) => w.word.toLowerCase().includes(query.toLowerCase())

    //   // (w) => ,
    //   // w.description.toLowerCase().includes(query.toLowerCase())
    // ),
    words: words.filter(
      (w) =>
        w.description.toLowerCase().includes(query.toLowerCase()) ||
        w.word.toLowerCase().includes(query.toLowerCase())
    ),
  });
  // console.log(typeof req.body);
});
server.post("/add", (req, res) => {
  // console.log(req.body);
  words.push(req.body);
  console.log(words);
  fs.writeFileSync('./db/words.json',JSON.stringify(words,null,2));
  res.render("add", {
    words,
  });
});
server.get("/add", (req, res) => {
  res.render("add", {
    words,
  });
});
server.get("/delete", (req, res) => {
  res.render("delete",{
    words,
  });
});

server.use((req, res) => {
  res.render("404");
});

server.listen(process.env.PORT || 3000, (err) => {
  if (err) return console.log(err);
  console.log("This OK 3000 port server");
});
