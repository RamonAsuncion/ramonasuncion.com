const express = require("express");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const { execFileSync } = require("child_process");
const { getPublicGithubRepos } = require("./public/js/getRepos.js");

const app = express();
const PORT = process.env.PORT || 3000;

const cache = {
  githubRepos: {},
  getCacheValidity: 24 * 60 * 60 * 1000, // 1 day in milliseconds
};

app.use(express.static(path.join(__dirname, "public")));

function getLastModifiedTime() {
  try {
    const lastModified = execFileSync("git", ["log", "-1", "--format=%ct"])
      .toString()
      .trim();
    const lastModifiedMS = lastModified * 1000;
    return lastModifiedMS;
  } catch (err) {
    console.log("could not get time", err);
    return null;
  }
}

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

app.get("/last-modified", (req, res) => {
  const lastModifiedTime = getLastModifiedTime();
  res.json({ lastModifiedTime });
});

app.get("/github-repos/:username", async (req, res) => {
  const username = req.params.username;

  const cachedData = cache.githubRepos[username];
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < cache.getCacheValidity) {
    console.log(`Using cached GitHub data for ${username}`);
    return res.json(cachedData.data);
  }

  try {
    console.log(`Fetching fresh GitHub data for ${username}`);
    const repos = await getPublicGithubRepos(username);

    cache.githubRepos[username] = {
      data: repos,
      timestamp: now,
    };

    res.json(repos);
  } catch (err) {
    console.error(`Error fetching repos for ${username}:`, err);

    if (cachedData) {
      console.log(`Returning stale cached data for ${username}`);
      return res.json(cachedData.data);
    }

    res.status(500).json({ err: "can't get repos" });
  }
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
