const config = require("../config.js");
const GIT_KEY = config.API_KEY;

let octokit = null;

async function initOctokit() {
  const { Octokit } = await import("octokit");
  octokit = new Octokit({
    auth: GIT_KEY,
  });
  return octokit;
}

async function getPublicGithubRepos(username) {
  try {
    const responseData = [];

    if (!octokit) {
      await initOctokit();
    }

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

initOctokit().catch((err) =>
  console.error("Failed to initialize Octokit:", err)
);

module.exports = {
  getPublicGithubRepos,
};
