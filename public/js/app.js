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
