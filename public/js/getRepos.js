const { Octokit } = require("octokit");
const config = require("./config.js");

const GIT_KEY = config.API_KEY;

const octokit = new Octokit({
  auth: GIT_KEY,
});

async function getPublicGithubRepos(username) {
  try {
    const responseData = [];

    const response = await octokit.request("GET /users/{username}/repos", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const repos = response.data;

    repos.forEach((repo) => {
      responseData.push({
        html_url: repo.html_url,
        description: repo.description || "",
        name: repo.name,
        created_at: new Date(repo.created_at).getFullYear(),
        language: repo.language || "N/A",
        homepage: repo.homepage || "",
      });
    });

    responseData.sort((a, b) => b.created_at - a.created_at);

    return responseData;
  } catch (err) {
    console.error("cant retrieve repos", err);
    return [];
  }
}

module.exports = {
  getPublicGithubRepos,
};
