/**
 * dynamically load project section and social media links based on data.yml file.
 */
fetch("/data")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("name").textContent = data.name;
    document.getElementById(
      "email"
    ).innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;

    const projectsSection = document.getElementById("projects-section");

    // fill in projects automatically (flag with github_user)
    if (data.projects && data.projects.github_user) {
      const githubUser = data.projects.github_user;
      console.log("git_user", githubUser);

      fetch(`/github-repos/${githubUser}`)
        .then((response) => response.json())
        .then((repos) => {
          console.log(repos);

          // todo: i need to get both of them working together. (manual + automatic)

          repos.forEach((repo) => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("project");

            const githubDomain = new URL(repo.html_url).hostname;
            let linksHTML = `
                  <p>
                    <span class="bullet">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>
                    <a href="${repo.html_url}" target="_blank">${githubDomain}</a>
                  </p>`;

            if (repo.homepage && repo.homepage !== "") {
              const homepageDomain = new URL(repo.homepage).hostname;

              linksHTML += `
                      <p>
                        <span class="bullet">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </span>
                        <a href="${repo.homepage}" target="_blank">${homepageDomain}</a>
                      </p>`;
            }

            projectElement.innerHTML = `
              <div class="project-info">
                  <p>${repo.name}, <time datetime="${repo.created_at}">${repo.created_at}</time></p>
              </div>
              <p>${repo.description}</p>
              ${linksHTML}`;

            projectsSection.appendChild(projectElement);
          });
        })
        .catch((error) => console.error("can't get data", error));
    }

    // this is for when there is manual stuff
    if (Array.isArray(data.projects)) {
      data.projects.forEach((project) => {
        if (!project || !Array.isArray(project.links)) return;
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");

        const linksHTML = project.links
          .filter((link) => link)
          .map((link) => {
            const domain = new URL(link).hostname;
            // awesome place to find fonts https://heroicons.com
            return `
                <p>
                  <span class="bullet">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  <a href="${link}" target="_blank">${domain}</a>
                </p>`;
          })
          .join("");

        projectElement.innerHTML = `
            <div class="project-info">
                <p>${project.name}, <time datetime="${project.year}">${project.year}</time></p>
            </div>
            <p>${project.description}</p>
            ${linksHTML}`;

        projectsSection.appendChild(projectElement);
      });
    }

    const socialLinksDiv = document.getElementById("social-links");
    if (data.social_links) {
      const socialLinksHTML = Object.entries(data.social_links)
        .flatMap(([platform, links]) =>
          links.map(
            (link) =>
              `<a href="${link}" target="_blank">${
                platform.charAt(0).toUpperCase() + platform.slice(1)
              }</a>`
          )
        )
        .join(" ");
      socialLinksDiv.innerHTML = socialLinksHTML;
    }
  })
  .catch((error) => console.error("can't load data", error));
