var part = "minutely,hourly";
var apiKey = "afd682401c0cee2cf220ad5a92b3a135";
var saveBtn = document.querySelector(".saveBtn");
var historyUl = document.querySelector(".history");
var currentCity = document.createElement("h2");

var currentDate = moment().format("ddd MMMM Do YYYY");
console.log(currentDate);

$(document).ready(function () {

  saveBtn.addEventListener("click", function () {
    cityName = document.querySelector(".city").value;
    console.log(cityName);

    cityHistory(cityName);
    gettingCurrentWeather(cityName);
  });

  //creates list item and appends to ul
  function cityHistory(cityName) {
    $("ul").append(
      `<li class='listItem' > <button class = "history">${cityName}</button></li>`
    );
    $(".listCity").attr("type", "button");
  }

  $(".cityList").on("click", ".history", function () {
    gettingCurrentWeather($(this).text());

  });

  var weather = document.querySelector(".currentWeather");

  var gettingCurrentWeather = function (city) {
    var currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(currentWeather).then(function (response) {
      $(".currentWeather").empty();
      $(".fiveDayForecast").empty();
      currentCity.textContent = city;
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          var tempTag = document.createElement("p");
          tempTag.textContent = "Temperature: " + data.main.temp + " F";
          var humidityTag = document.createElement("p");
          humidityTag.textContent = "Humidity: " + data.main.humidity + "%";
          var windSpeedTag = document.createElement("p");
          windSpeedTag.textContent = "Wind Speed: " + data.wind.speed + " MPH";
          var lat = data.coord.lat;
          var lon = data.coord.lon;
          weather.append(
            currentCity,
            currentDate,
            tempTag,
            humidityTag,
            windSpeedTag
          );
          oneCall(lat, lon);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    });
  };

  //oneCallApi to get the UV index for the current weather, and to get the 5 day forecast
  var oneCall = function (lat, lon) {
    var oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}&units=imperial`;
    fetch(oneCallAPI).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //gets the UV index from the oneCall API and adds it to the current weather window
          var uvIndexTag = document.createElement("p");
          uvIndexTag.textContent = "UV Index: " + data.current.uvi;
          weather.append(uvIndexTag);
          var slicedArray = data.daily.slice(0, 6);

          console.log(uvIndexTag);

          if (data.current.uvi < 3) {
            uvIndexTag.className = "low";
          } else if (data.current.uvi > 2 && data.current.uvi < 6) {
            uvIndexTag.className = "moderate";
          } else {
            uvIndexTag.className = "high";
          }

          //this starts calling for the 5 day forecast
          var forecast = document.querySelector(".fiveDayForecast");

          for (var i = 1; i < slicedArray.length; i++) {
            var element = slicedArray[i];
            console.log(element);
            var card = document.createElement("div");
            card.setAttribute("class", "card");
            var cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card-body");

            var dateEl = document.createElement("P");
            dateEl.textContent = moment().add(i, "days").format("ddd MM/DD/YYYY");

            var iconCode = element.weather[0].icon;
            var weatherIcon = document.createElement("img");
            var iconURL =
              "https://openweathermap.org/img/w/" + iconCode + ".png";
            weatherIcon.setAttribute("src", iconURL);

            console.log(weatherIcon);

            var highTempTag = document.createElement("p");
            highTempTag.textContent =
              " High Temperature: " + element.temp.max + " F";
            var lowTempTag = document.createElement("p");
            lowTempTag.textContent =
              " Low Temperature: " + element.temp.min + " F";
            var windSpeedTag = document.createElement("p");
            windSpeedTag.textContent =
              "Wind Speed: " + element.wind_speed + " MPH";
            var humidityTag = document.createElement("p");
            humidityTag.textContent = "Humidity: " + element.humidity + "%";

            cardBody.append(
              dateEl,
              weatherIcon,
              highTempTag,
              lowTempTag,
              windSpeedTag,
              humidityTag
            );
            card.append(cardBody);
            forecast.append(card);
          }
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    });
  };
});
