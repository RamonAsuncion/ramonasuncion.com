const { Octokit } = require("octokit");
const config = require("./config.js");

const GIT_KEY = config.API_KEY;

const octokit = new Octokit({
  auth: GIT_KEY,
});

async function getPublicGithubRepos(username) {
  try {
    const response = await octokit.request("GET /users/{username}/repos", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const repos = response.data;
    repos.forEach(repo => {
      console.log({
        git_url: repo.git_url,
        description: repo.description,
        name: repo.name,
        created_at: repo.created_at,
        language: repo.language
      });
    });
  } catch (error) {
    console.error(error);
  }
}

getPublicGithubRepos("RamonAsuncion");

// git_url
// description (could be null)
// name
// created_at
