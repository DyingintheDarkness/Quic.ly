const express = require("express");
const app = express();
const uniqid = require("uniqid");
const path = require("path")
const port = 5000;

//engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine("html", require("ejs").renderFile)



app.listen(port, (req, res) => {
  console.log(`Server is listening on port 5000.... 
Localhost : http://localhost:${port}/
  `);
});




app.get("/", (req, res) => {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./localStorage");
  }
  res.render("index.html", {ids: "8282118",urls: "lol"});
  const url = req.query.url;
  if (url !== undefined) {
    const id = uniqid();
    let exists = false;
    if (localStorage) {
      for (let i = 0; i < localStorage._keys.length; i++) {
        const localid = localStorage._keys[i];
        const localurl = localStorage.getItem(localid);
        if (localid !== id && localurl === url) {
          exists = true;
          break;
        }
      }
      if (exists === false) {
        localStorage.setItem(id, url);
      }
    }
  }
  redirectLink(localStorage);
});

const redirectLink = (localStorage) => {
  let urlExists = false
  let url;
  app.get("/:id", (req, res) => {
    const id = req.params.id;
    const keys = localStorage._keys;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const storedurl = localStorage.getItem(key)
      if(key === id){
        urlExists = true;
        url = storedurl
        break;
      }
    }
    if (urlExists) {
      res.redirect(url);
    } else {
      res.render("404.html");
    }
  });
};

const sendData = (localStorage) => {
  app.get("/", (req, res) => {});
};
