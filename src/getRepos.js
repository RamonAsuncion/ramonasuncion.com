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
    // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
    const perPage = 100;
    let page = 1;
    let hasMorePages = true;

    if (!octokit) {
      await initOctokit();
    }

    while (hasMorePages) {
      const response = await octokit.request("GET /users/{username}/repos", {
        username: username,
        per_page: perPage,
        page: page,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const repos = response.data;

      if (repos.length === 0) {
        hasMorePages = false;
        break;
      }

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

      page++;
    }

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
