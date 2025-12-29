## Cognifyz Level 4 – Task 8: Advanced Server-Side Functionality

# Weather Dashboard
  
A dynamic Weather Dashboard web application built with **Node.js, Express.js, and OpenWeatherMap API**

**Objective:** Implement advanced server-side features for a robust application.

**Implementation in Weather Dashboard:**
1. **Middleware:**  
   - JSON body parser (`express.json()`)  
   - Logging middleware to track all incoming requests  

2. **Background Tasks / Job Processing:**  
   - `node-cron` runs every hour to fetch and update weather data for popular cities  

3. **Server-Side Caching:**  
   - Cached weather data for cities to reduce API calls  
   - Cache expires every 10 minutes for fresh data.

## Features

- Search any city for current weather
- Shows temperature, humidity, and wind speed
- Dynamic background based on weather
- Clouds animation
- Caching for frequently searched cities
- Cron job updates for popular cities
