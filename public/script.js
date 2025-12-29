document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("search-button");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");

  // Add clouds to body
  for (let i = 0; i < 3; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    document.body.appendChild(cloud);
  }

  // Fetch weather from backend API
  const getWeather = async (city) => {
    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
      );
      const data = await response.json();

      if (data.error) {
        cityName.textContent = "City not found!";
        temperature.textContent = "Temperature: --°C";
        humidity.textContent = "Humidity: --%";
        windSpeed.textContent = "Wind Speed: -- m/s";
        return;
      }

      // Update UI with weather data
      cityName.textContent = `${data.data.name}, ${data.data.sys.country}`;
      temperature.textContent = `Temperature: ${Math.round(
        data.data.main.temp
      )}°C`;
      humidity.textContent = `Humidity: ${data.data.main.humidity}%`;
      windSpeed.textContent = `Wind Speed: ${data.data.wind.speed} m/s`;

      updateSky(data.data.weather[0].main);
    } catch (error) {
      console.error("Error:", error);
      cityName.textContent = "Error fetching weather";
      temperature.textContent = "Temperature: --°C";
      humidity.textContent = "Humidity: --%";
      windSpeed.textContent = "Wind Speed: -- m/s";
    }
  };

  // Dynamic sky colors based on weather
  const updateSky = (condition) => {
    const body = document.body;
    if (condition === "Clear") {
      body.style.background =
        "linear-gradient(135deg, #87CEEB 0%, #98D8C8 50%, #F0F8FF 100%)";
    } else if (condition === "Clouds") {
      body.style.background =
        "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 50%, #34495e 100%)";
    } else if (condition === "Rain") {
      body.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    } else {
      body.style.background =
        "linear-gradient(135deg, #87CEEB 0%, #98D8C8 50%, #F0F8FF 100%)";
    }
  };

  // Event listeners
  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  });

  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) getWeather(city);
    }
  });

  // Default city load
  getWeather("Salem");
});
    // Tamil Nadu 