require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static UI
app.use(express.static("public"));

// Simple in-memory cache
const cache = {};

// Weather API endpoint
app.get("/api/weather", async (req, res) => {
  let city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  city = city.trim();
  const cacheKey = city.toLowerCase();

  // Check cache
  if (cache[cacheKey]) {
    return res.json({ source: "cache", data: cache[cacheKey] });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);

    // Store in cache (expires in 10 minutes)
    cache[cacheKey] = response.data;
    setTimeout(() => {
      delete cache[cacheKey];
    }, 10 * 60 * 1000);

    res.json({ source: "api", data: response.data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// List of 50 popular cities
const cities = [
  // Tamil Nadu
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Trichy",
  "Salem",
  "Erode",
  "Tirunelveli",
  "Vellore",
  "Nagercoil",
  "Dindigul",
  "Thanjavur",
  "Nagapattinam",
  "Cuddalore",
  "Tiruppur",
  "Karur",
  "Sivakasi",
  "Kanchipuram",
  "Villupuram",
  "Ramanathapuram",
  "Tiruvannamalai",
  "Yercaud",
  "Hosur",
  "Ooty",
  "Kodaikanal",

  // India
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Trivandrum",

  // Hill / Tourist
  "Munnar",
  "Manali",
  "Shimla",
  "Darjeeling",

  // International
  "Dubai",
  "Singapore",
  "London",
  "New York",
  "Tokyo",
];

// Cron job: fetch weather for all cities every hour
cron.schedule("0 * * * *", async () => {
  console.log("Fetching weather data for cities...");
  for (const city of cities) {
    const cacheKey = city.toLowerCase();
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      cache[cacheKey] = response.data;
      console.log(`Updated weather data for ${city}`);
    } catch (error) {
      console.error(`Failed to fetch weather data for ${city}`);
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
