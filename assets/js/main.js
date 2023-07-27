"use strict";

import { apiKey } from "./api.js";

//# input

const userCountryInput = document.querySelector("#country-input");
const userCityInput = document.querySelector("#city-input");
const sendButton = document.querySelector(".send");

//# output

const weatherCityOutput = document.querySelector(".weather-city");
const weatherConditionOutput = document.querySelector(".weather-output");

const localTimeOutput = document.querySelector(".local-time-day");
const localTimeClockOutput = document.querySelector(".local-time-clock");
const localDateOutput = document.querySelector(".local-time-date");
const temperatureOutput = document.querySelector(".temperature");
const weatherCondition = document.querySelector(".weather-condition");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const rain = document.querySelector(".rain");

let lat;
let lon;

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=51.233334&&lon=6.783333&appid=${apiKey}&units=metric`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Hier hat irgendwas nicht funktioniert.");
    }
    return response.json();
  })
  .then((data) => {
    const localDate = new Date(data.dt * 1000);
    const localTimezoneOffset = localDate.getTimezoneOffset() * 60;

    localTimeOutput.textContent = `${new Date(
      data.dt * 1000 + data.timezone * 1000 + localTimezoneOffset * 1000
    ).toLocaleDateString("us-US", { weekday: "long" })}`;

    localTimeClockOutput.textContent = `${new Date(
      data.dt * 1000 + data.timezone * 1000 + localTimezoneOffset * 1000
    ).toLocaleTimeString("us-US")}`;

    localDateOutput.textContent = `${new Date(
      data.dt * 1000 + data.timezone * 1000 + localTimezoneOffset * 1000
    ).toLocaleDateString("us-US", { year: "numeric", month: "short", day: "numeric" })}`;

    weatherConditionOutput.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
    temperatureOutput.textContent = `${data.main.temp.toFixed(0)} °C`;
    weatherCondition.textContent = `${data.weather[0].description}`;
    pressure.textContent = `${data.main.pressure} hpa`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s, ${data.wind.deg} °`;

    if (data.rain) {
      rain.textContent = `${data.rain["1h"]} mm`;
    } else {
      rain.textContent = `--`;
    }

    console.log(data);
  })

  .then(() => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=Düsseldorf, Deutschland&limit=1&appid=${apiKey}&units=metric`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hier hat irgendwas nicht funktioniert.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        weatherCityOutput.textContent = `${data[0].name}, ${data[0].country}`;
        return data;
      });
  })

  .catch((error) => console.log(error));

sendButton.addEventListener("click", () => {
  const userCountryInputValue = userCountryInput.value.toLowerCase();
  const userCityInputValue = userCityInput.value.toLowerCase();
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userCityInputValue}, ${userCountryInputValue}&limit=1&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hier hat irgendwas nicht funktioniert.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      weatherCityOutput.textContent = `${data[0].name}, ${data[0].country}`;
      lat = data[0].lat;
      lon = data[0].lon;
      return data;
    })

    .then(() => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&&lon=${lon}&appid=${apiKey}&units=metric`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Hier hat irgendwas nicht funktioniert.");
          }
          return response.json();
        })
        .then((data) => {
          const localDate = new Date(data.dt * 1000);
          const localTimezoneOffset = localDate.getTimezoneOffset() * 60;

          localTimeOutput.textContent = `${new Date(
            data.dt * 1000 + data.timezone * 1000 + localTimezoneOffset * 1000
          ).toLocaleDateString("us-US", { weekday: "long" })}`;

          localTimeClockOutput.textContent = `${new Date(
            data.dt * 1000 + data.timezone * 1000 + localTimezoneOffset * 1000
          ).toLocaleTimeString("us-US")}`;

          localDateOutput.textContent = `${new Date(
            data.dt * 1000 + data.timezone * 1000 + localTimezoneOffset * 1000
          ).toLocaleDateString("us-US", { year: "numeric", month: "short", day: "numeric" })}`;

          weatherConditionOutput.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
          temperatureOutput.textContent = `${data.main.temp.toFixed(0)} °C`;
          weatherCondition.textContent = `${data.weather[0].description}`;
          pressure.textContent = `${data.main.pressure} hpa`;
          humidity.textContent = `${data.main.humidity}%`;
          wind.textContent = `${data.wind.speed} m/s, ${data.wind.deg} °`;
          if (data.rain) {
            rain.textContent = `${data.rain["1h"]} mm`;
          } else {
            rain.textContent = `--`;
          }

          console.log(data);
        })
        .catch((error) => console.log(error));
    })

    .catch((error) => console.log(error));
});
