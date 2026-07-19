const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.querySelector(".weather-card");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");

async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to search city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Check the spelling.");
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(weatherData.current, location);
    } catch (error) {
        showError(error.message);
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

function displayWeather(current, location) {
    cityName.textContent = `${location.name}, ${location.country_code}`;

    temperature.textContent =
        `${Math.round(current.temperature_2m)}°C`;

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    wind.textContent =
        `${current.wind_speed_10m} km/h`;

    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;

    const weatherInfo = getWeatherInfo(current.weather_code);

    description.textContent = weatherInfo.description;
    weatherIcon.src = weatherInfo.icon;
    weatherIcon.alt = weatherInfo.description;

    weatherCard.classList.remove("error-card");
}

function getWeatherInfo(code) {
    const weatherCodes = {
        0: {
            description: "Clear sky",
            icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png"
        },
        1: {
            description: "Mainly clear",
            icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
        },
        2: {
            description: "Partly cloudy",
            icon: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
        },
        3: {
            description: "Overcast",
            icon: "https://cdn-icons-png.flaticon.com/512/414/414825.png"
        },
        45: {
            description: "Foggy",
            icon: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"
        },
        48: {
            description: "Foggy",
            icon: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"
        },
        51: {
            description: "Light drizzle",
            icon: "https://cdn-icons-png.flaticon.com/512/3075/3075858.png"
        },
        53: {
            description: "Drizzle",
            icon: "https://cdn-icons-png.flaticon.com/512/3075/3075858.png"
        },
        55: {
            description: "Heavy drizzle",
            icon: "https://cdn-icons-png.flaticon.com/512/3075/3075858.png"
        },
        61: {
            description: "Light rain",
            icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
        },
        63: {
            description: "Moderate rain",
            icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
        },
        65: {
            description: "Heavy rain",
            icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
        },
        71: {
            description: "Light snow",
            icon: "https://cdn-icons-png.flaticon.com/512/642/642102.png"
        },
        73: {
            description: "Snowfall",
            icon: "https://cdn-icons-png.flaticon.com/512/642/642102.png"
        },
        75: {
            description: "Heavy snow",
            icon: "https://cdn-icons-png.flaticon.com/512/642/642102.png"
        },
        80: {
            description: "Rain showers",
            icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
        },
        81: {
            description: "Rain showers",
            icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
        },
        82: {
            description: "Heavy rain showers",
            icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
        },
        95: {
            description: "Thunderstorm",
            icon: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"
        },
        96: {
            description: "Thunderstorm with hail",
            icon: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"
        },
        99: {
            description: "Severe thunderstorm",
            icon: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"
        }
    };

    return weatherCodes[code] || {
        description: "Weather information",
        icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
    };
}

function showError(message) {
    cityName.textContent = "Weather unavailable";
    temperature.textContent = "--";
    description.textContent = message;
    humidity.textContent = "--";
    wind.textContent = "--";
    feelsLike.textContent = "--";
    weatherIcon.src = "";
    weatherIcon.alt = "";

    weatherCard.classList.add("error-card");
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

cityInput.value = "Delhi";
getWeather();