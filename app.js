const express = require("express");
const app = express();
const uniqid = require("uniqid");
const port = 5000;
app.listen(port, (req, res) => {
  console.log(`Server is listening on port 5000.... 
Localhost : http://localhost:${port}/
  `);
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./localStorage");
  }
  const url = req.query.url;
  if (url !== undefined) {
    if (localStorage) {
      const id = uniqid();
      localStorage.setItem(id, url);
    }
  }
  redirectLink(localStorage);
});

const redirectLink = (localStorage) => {
  app.get("/:id", (req, res) => {
    const id = req.params.id;
    const keys = localStorage._keys;
    for (let i = 0; i < keys.length; i++) {
      const url = localStorage.getItem(keys[i]);
      if (keys[i] === id) {
        res.redirect(url);
      } else {
        res.sendFile("404.html", { root: __dirname });
      }
    }
  });
};

const sendData = (localStorage) => {
  app.get("/", (req, res) => {});
};
