require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// Check if API key is set
if (!process.env.WEATHER_API_KEY) {
    console.error("❌ ERROR: WEATHER_API_KEY is not set. Please add it in your .env or Render environment variables.");
    process.exit(1); // stop server if key is missing
}

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve frontend
app.use(express.static("public"));

// Simple cache
const cache = {};

// Weather API endpoint
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City parameter is required" });

    // Check cache
    if (cache[city]) {
        return res.json({ source: "cache", data: cache[city] });
    }

    try {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);

        // Store in cache
        cache[city] = response.data;
        setTimeout(() => delete cache[city], 10 * 60 * 1000); // 10 minutes

        res.json({ source: "api", data: response.data });
    } catch (error) {
        console.error(`Failed to fetch weather for ${city}:`, error.message);
        res.status(500).json({ error: "Failed to fetch weather data. Check city name or API key." });
    }
});

// Popular cities cron job
const cities = ["Chennai","Mumbai","Delhi","Kolkata","Bangalore","Hyderabad","Pune","Ahmedabad","Coimbatore","Salem",
  "Trichy","Madurai","Tirunelveli","Erode","Vellore","Nagercoil","Dindigul","Thanjavur","Nagapattinam","Cuddalore",
  "Tiruppur","Karur","Sivakasi","Kanchipuram","Villupuram","Ramanathapuram","Tiruvannamalai","Yercaud","Hosur",
  "Ooty","Kodaikanal","Munnar","Manali","Shimla","Darjeeling","New York","London","Paris","Tokyo","Singapore",
  "Dubai","Los Angeles","San Francisco","Sydney","Melbourne","Toronto","Vancouver","Jaipur","Kochi","Trivandrum"
];

cron.schedule("0 * * * *", async () => {
    console.log("Fetching weather data for popular cities...");
    for (const city of cities) {
        try {
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
            const response = await axios.get(url);
            cache[city] = response.data;
            console.log(`✅ Updated weather data for ${city}`);
        } catch (error) {
            console.error(`❌ Failed to fetch weather for ${city}: ${error.message}`);
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
});
