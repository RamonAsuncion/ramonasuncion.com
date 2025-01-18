fetch("/last-modified")
  .then((response) => response.json())
  .then((data) => {
    console.log("data", data);
    const lastModifiedMS = data.lastModifiedTime;
    console.log("unix time (client)", lastModifiedMS);

    if (lastModifiedMS) {
      const localDate = new Date(lastModifiedMS);
      const localDateTime = new Date(lastModifiedMS);

      let dayOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      let timeOptions = {
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone: "America/New_York",
      };

      let dateHRF =
        localDate.toLocaleDateString("en-US", dayOptions) +
        " " +
        localDateTime.toLocaleTimeString("en-US", timeOptions);

      document.getElementById("last-modified").textContent =
        "Modified " + dateHRF;
    }
  })
  .catch((error) => console.error("could not get last time modified", error));
