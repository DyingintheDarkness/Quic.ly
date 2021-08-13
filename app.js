// Made by DyingintheDarkness
// https://github.com/DyingintheDarkness
const express = require("express");
const app = express();
const uniqid = require("uniqid");
const path = require("path");
const port = 5000;
var QRCode = require("qrcode");
let qr_code;
let newqrcode;

// Setting Up localStorage

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./localStorage");
}

// Setting Up Engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));
app.listen(port, (req, res) => {
  console.log(`Server is listening on port 5000.... 
Localhost : http://localhost:${port}/
  `);
});

// Homepage

app.get("/", (req, res) => {
  let id = uniqid();
  qr_code =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOBSURBVO3BO44sSQIDQfdA3f/K3CeMQCmARFb3fJZm5g9m/nKYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgpH15S+U1JaCotCU+o3CThRqUloan8piS8cZgph5lymCkfviwJ36TyhsoTSXgiCU8k4ZtUvukwUw4z5TBTPvwwlSeS8IZKS0JTeULliSQ8ofJEEn7SYaYcZsphpnz4l0vCjcobSbhR+S85zJTDTDnMlA//ciotCS0JTaUl4UalJaEl4b/kMFMOM+UwUz78sCT8pCQ0lZaEloQnknCj0pLwRBL+SQ4z5TBTDjPlw5ep/CaVloSm0pLQVFoSmkpLwhsq/2SHmXKYKYeZYv7g/5jKTRJuVFoS/s0OM+UwUw4z5cNLKi0JNyq/KQlN5Q2VloSm0pJwo9KS0FSeSMIbh5lymCmHmfLhy1RaEp5Iwo3KEyo3SbhReSIJNyo3Kk8k4ZsOM+UwUw4z5cOXJeEmCU2lqdwk4QmVn6TyRhKaSkvCjUpLwhuHmXKYKYeZYv7gb6TSkvCbVFoSblRuknCj8pOS8MZhphxmymGmfPgylZaEpnKjcpOEJ1RuktBUnkjCjcpNEt5Q+abDTDnMlMNMMX/wgkpLwhsqLQk3KjdJuFH5piQ8odKScKPSkvBNh5lymCmHmfLhy1TeSEJTaUn4piQ0lZaEptKScKNyk4Sm8oRKS8Ibh5lymCmHmfLhy5Jwo/JEEp5IwhMqNypPqLyRhKbSktBUvukwUw4z5TBTPvyyJDSVpvJEEprKT0pCU3lDpSXhRqUl4ZsOM+UwUw4z5cNLSXgjCW+otCQ0lZskNJWWhCeS8ITKTRKayk86zJTDTDnMlA8vqfymJNyotCTcqPwklZaEG5WWhJaEptKS8MZhphxmymGmfPiyJHyTyhsqN0loKk3ljSQ8kYS/02GmHGbKYaZ8+GEqTyThjSQ0lTeS0FRuVN5QaUn4TYeZcpgph5ny4T8uCTcqNyotCU3liSTcqNyo/KTDTDnMlMNM+fAvl4Sm0pLQVFoSmkpLQlN5IglN5SYJTeU3HWbKYaYcZsqHH5aEfzKVJ5LwX3aYKYeZcpgpH75M5TeptCT8JpUnknCj0pJwo/JNh5lymCmHmWL+YOYvh5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmfI/XlZ0NABKG3YAAAAASUVORK5CYII=";
  const url = req.query.url;
  const full_url = `${req.protocol}//${req.get("host")}/`;
  res.render("index.html", {
    ids: localStorage._keys,
    qr_code: newqrcode,
    oldqr: qr_code,
    url: url,
    local: localStorage,
    full_url: full_url,
    id: id,
  });
  if (url !== undefined) {
    QRCode.toDataURL(url, function (err, qrcode) {
      newqrcode = qrcode;
    });
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

// History Page

app.get("/history", (req, res) => {
  const full_url = `${req.protocol}//${req.get("host")}/`;
  res.render("history.html", {
    ids: localStorage._keys,
    local: localStorage,
    full_url: full_url,
  });
});
app.get("/history/*", (req, res) => {
  res.render("404.html");
});

const redirectLink = (localStorage) => {
  let urlExists = false;
  let url;
  app.get("/:id", (req, res) => {
    const id = req.params.id;
    const keys = localStorage._keys;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const storedurl = localStorage.getItem(key);
      if (key === id) {
        urlExists = true;
        url = storedurl;
        break;
      }
    }
    if (urlExists) {
      res.redirect(url);
      urlExists = false;
    } else {
      res.render("404.html");
    }
  });
};
