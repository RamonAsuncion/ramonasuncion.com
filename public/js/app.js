/**
 * dynamically load project section and social media links based on data.yml file.
 */

const loading = document.getElementById("loading");
loading.classList.add("active");

// show light box on click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("project-img")) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightbox.style.display = "flex";
    lightboxImg.src = e.target.src;
  }
});

document.querySelector(".lightbox .close").addEventListener("click", () => {
  document.getElementById("lightbox").style.display = "none";
});

document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") {
    e.target.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("lightbox").style.display = "none";
  }
});

fetch("/data")
  .then((response) => response.json())
  .then((data) => {
    // Name & Email
    document.getElementById("name").textContent = data.name;
    document.getElementById(
      "email"
    ).innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;

    // Projects
    const projectsSection = document.getElementById("projects-section");
    if (data.projects) {
      const projectsHTML = data.projects
        .map(
          (proj) => `
        <div class="project">
          <img src="${proj.image}" alt="${proj.title}" class="project-img" />
          <div class="project-info">
            <h3>
              <a href="${proj.link}" target="_blank">
                ${proj.title}
              </a>
            </h3>
            <p>
              ${proj.description}
              ${proj.blog ? ` <a id="blog-link" href="${proj.blog}" target="_blank">Learn more</a>` : ""}
            </p>
            <span>${proj.tech.join(" · ")}</span>
          </div>
        </div>
        `
        )
        .join("");
      projectsSection.insertAdjacentHTML("beforeend", projectsHTML);
    }

    // Socials
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
