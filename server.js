const express = require("express");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/data", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "data.yml"),
    "utf8",
    (err, yamlText) => {
      if (err) {
        return res.status(400).send("data.yml not found");
      }

      const data = yaml.load(yamlText);
      res.json(data);
    }
  );
});

// 404 everything else
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("server failed", err);
    return;
  }
  console.log(`server on http://localhost:${PORT}`);
});
