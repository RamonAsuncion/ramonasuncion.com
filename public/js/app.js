/**
 * dynamically load project section and social media links based on data.yml file.
 */

const loading = document.getElementById("loading");
loading.classList.add("active");

fetch("/data")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("name").textContent = data.name;
    document.getElementById(
      "email"
    ).innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;

    const projectsSection = document.getElementById("projects-section");
    let githubProjects = [];

    if (data.use_github && data.github_user) {
      const githubUser = data.github_user;

      fetch(`/github-repos/${githubUser}`)
        .then((response) => response.json())
        .then((repos) => {
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
                  <p>${
                    repo.name
                  }, ${repo.language.toLowerCase()} · <time datetime="${
              repo.created_at
            }">${repo.created_at}</time></p>
              </div>
              <p>${repo.description}</p>
              ${linksHTML}`;

            githubProjects.push({
              element: projectElement,
              year: Number(repo.created_at),
            });

            projectsSection.appendChild(projectElement);
          });
          processUserDefinedProjects(data.projects);
        })
        .catch((err) => console.error("can't get data", err));
    } else {
      processUserDefinedProjects(data.projects);
    }

    function processUserDefinedProjects(projects) {
      if (Array.isArray(projects)) {
        projects.forEach((project) => {
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
                <p>${
                  project.name
                }, ${project.language.toLowerCase()} · <time datetime="${
            project.year
          }">${project.year}</time></p>
            </div>
            <p>${project.description}</p>
            ${linksHTML}`;

          addUserDefinedProjects(projectElement, project.year);
        });
      }
    }

    function addUserDefinedProjects(projectElement, projectYear) {
      if (!projectElement || projectYear < 0) {
        console.error("no user project defined");
        return;
      }

      // no github projects.
      if (githubProjects.length === 0) {
        projectsSection.appendChild(projectElement);
        return;
      }

      let projectAdded = false;

      for (let i = 0; i < githubProjects.length; ++i) {
        const githubYear = githubProjects[i].year;
        if (projectYear >= githubYear) {
          // since no exact time put before github projects.
          projectsSection.insertBefore(
            projectElement,
            githubProjects[i].element
          );
          // add to projects array to maintain order.
          githubProjects.splice(i, 0, {
            element: projectElement,
            year: projectYear,
          });
          projectAdded = true;
          break;
        }
      }

      if (!projectAdded) {
        projectsSection.appendChild(projectElement);
        githubProjects.push({ element: projectElement, year: projectYear });
      }
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
  .finally(() => {
    loading.classList.remove("active");
  })
  .catch((err) => console.error("can't load data", err));
