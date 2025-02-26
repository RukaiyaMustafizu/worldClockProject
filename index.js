let searchedCityTimeZone = null;

function updateTime() {
  //tilburg//
  let tilburgElement = document.querySelector("#tilburg");
  let tilburgDateElement = tilburgElement.querySelector(".date");
  let tilburgTimeElement = tilburgElement.querySelector(".time");
  let tilburgTime = moment()
    .tz("Europe/Amsterdam")
    .format("h:mm:ss  [<small>] A[</small>]");
  tilburgDateElement.innerHTML = moment()
    .tz("Europe/Amsterdam")
    .format("MMMM Do YYYY");
  tilburgTimeElement.innerHTML = tilburgTime;

  //london//
  let londonElement = document.querySelector("#london");
  let londonDateElement = londonElement.querySelector(".date");
  let londonTimeElement = londonElement.querySelector(".time");
  let londonTime = moment()
    .tz("Europe/London")
    .format("h:mm:ss  [<small>] A[</small>]");
  londonDateElement.innerHTML = moment()
    .tz("Europe/London")
    .format("MMMM Do YYYY");
  londonTimeElement.innerHTML = londonTime;

  // Update selected city
  let citySelect = document.querySelector("#city-select");
  let selectedCityTimeZone = citySelect.value;
  if (selectedCityTimeZone === "current") {
    selectedCityTimeZone = moment.tz.guess();
  }
  let selectedCityName = selectedCityTimeZone.replace("_", " ").split("/")[1];
  let selectedCityTime = moment().tz(selectedCityTimeZone);
  let citiesElement = document.querySelector("#cities");
  citiesElement.innerHTML = `
    <div class="city">
      <h2>${selectedCityName}</h2>
      <div class="date">${selectedCityTime.format("MMMM Do YYYY")}</div>
      <div class="time">${selectedCityTime.format(
        "h:mm:ss [<small>]A[</small>]"
      )}</div>
    </div>
  `;

  // Update searched city
  if (searchedCityTimeZone) {
    let searchedCityName = searchedCityTimeZone.replace("_", " ").split("/")[1];
    let searchedCityTime = moment().tz(searchedCityTimeZone);
    citiesElement.innerHTML =
      `
      <div class="city">
        <h2>${searchedCityName}</h2>
        <div class="date">${searchedCityTime.format("MMMM Do YYYY")}</div>
        <div class="time">${searchedCityTime.format(
          "h:mm:ss [<small>]A[</small>]"
        )}</div>
      </div>
    ` + citiesElement.innerHTML; // Prepend the searched city to the top
  }
}

// Update the time immediately and then every 1000ms
updateTime();
setInterval(updateTime, 1000);

function updateCity(event) {
  searchedCityTimeZone = null; // Clear the searched city when selecting from dropdown
  updateTime();
}

let citiesSelect = document.querySelector("#city-select");
citiesSelect.addEventListener("change", updateCity);

function searchCity() {
  let searchQuery = document.querySelector("#city-search").value.toLowerCase();
  let timeZone = moment.tz
    .names()
    .find((zone) => zone.toLowerCase().includes(searchQuery));
  if (timeZone) {
    searchedCityTimeZone = timeZone;
    updateTime();
  } else {
    alert("City not found. Please try another city.");
  }
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

// Get user's current location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let currentTimeZone = moment.tz.guess();
    let currentCityName = currentTimeZone.replace("_", " ").split("/")[1];
    let currentCityTime = moment().tz(currentTimeZone);
    let citiesElement = document.querySelector("#cities");
    citiesElement.innerHTML =
      `
      <div class="city current-location">
        <h2>${currentCityName}</h2>
        <div class="date">${currentCityTime.format("MMMM Do YYYY")}</div>
        <div class="time">${currentCityTime.format(
          "h:mm:ss [<small>]A[</small>]"
        )}</div>
      </div>
    ` + citiesElement.innerHTML; // Prepend the current location to the top
  });
}
