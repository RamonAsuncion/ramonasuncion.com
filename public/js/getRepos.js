const { Octokit } = require("octokit");
const config = require("./config.js");

const GIT_KEY = config.API_KEY;

// save this into json file
// to not constantly spam this.
// or maybe just check with the
// git api if anything has been pushed
// but is this really necessary

async function getPublicGithubRepos(username) {
  const octokit = new Octokit({
    auth: GIT_KEY,
  });

  const repos = await octokit.request("GET /users/{username}/repos", {
    username: username,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  console.log("Repos:", repos);
}

getPublicGithubRepos("RamonAsuncion");

// git_url
// description (could be null)
// name
// created_at
