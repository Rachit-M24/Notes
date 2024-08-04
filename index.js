const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (error, files) => {
    res.render("index", { files: files });
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (error, filedata) => {
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});

app.get("/rename/:filename", (req, res) => {
  res.render("rename", { filename: req.params.filename });
});

app.post("/rename", (req, res) => {
  fs.rename(`./files/${req.body.old}`,`./files/${req.body.new}`,(err) => {
    res.redirect("/");
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (error) => {
    res.redirect("/");
    console.log((error = "Something went wrong"));
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join(" ")}.txt`,
    req.body.content,
    (error) => {
      res.redirect("/");
    }
  );
});

app.use((error, req, res, next) => {
  res.send((error = "you're dead"));
  res.status(500).send("Internal Server Error");
});

app.listen(3000);
