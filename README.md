# WeatherApp.JS

A full-stack weather application built with **Express.js**, **MongoDB**, and **React**. Users register and log in to receive a JWT, which they use to query real-time weather data — temperature, wind, pressure, precipitation, and a full air-quality index — for any city in the world.

---

## Project Structure

```
WeatherApp.JS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── env.js              # Environment variable loader
│   │   ├── controllers/
│   │   │   └── auth.controller.js  # register, login, getWeather
│   │   ├── models/
│   │   │   └── auth.model.js       # User schema
│   │   ├── routes/
│   │   │   └── auth.routes.js      # POST /register, POST /login, POST /getWeather
│   │   ├── services/
│   │   │   └── weather.service.js  # WeatherAPI integration
│   │   └── app.js                  # Express app setup
│   ├── server.js                   # Entry point
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthPage.jsx         # Login + Register UI
    │   │   ├── WeatherDashboard.jsx # Weather search + results
    │   │   └── Toast.jsx            # Notification component
    │   ├── api.js                   # Fetch wrapper + API calls
    │   ├── App.jsx                  # Root component + auth state
    │   ├── main.jsx                 # React entry point
    │   └── index.css                # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- A free API key from [WeatherAPI](https://www.weatherapi.com/)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/WeatherApp.JS.git
cd WeatherApp.JS
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/weatherapp
JWT_SECRET=your_jwt_secret_here
WEATHER_API_KEY=your_weatherapi_key_here
```

Start the backend:

```bash
npm run dev
```

Server will start on `http://localhost:8080`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:3000`.

---

## API Reference

**Base URL:** `http://localhost:8080/api/v1`

---

### Register

```
POST /register
```

**Body**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response** `201`
```json
{
  "success": true,
  "message": "User Registered Successfully",
  "user": {
    "id": "64abc123def456",
    "email": "user@example.com"
  }
}
```

---

### Login

```
POST /login
```

**Body**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response** `200`
```json
{
  "success": true,
  "message": "User Validated Successfully",
  "token": "<jwt>",
  "user": {
    "email": "user@example.com"
  }
}
```

---

### Get Weather

```
POST /getWeather
```

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**
```json
{
  "cityName": "Mumbai"
}
```

**Response** `200`
```json
{
  "success": true,
  "data": {
    "dataOf":        { "city": "Mumbai", "state": "Maharashtra", "country": "India" },
    "temperature":   { "temperature_c": 31.0, "temperature_f": 87.8 },
    "wind":          { "wind_mph": 8.1, "wind_kph": 13.0, "wind_degree": 290 },
    "pressure":      { "pressure_mb": 1008.0, "pressure_in": 29.77 },
    "precipitation": { "precipitation_mm": 0.0, "precipitation_in": 0.0 },
    "humidity":      74,
    "feels_like":    { "feelslike_c": 36.2, "feelslike_f": 97.2 },
    "heat_index":    { "heatindex_c": 36.2, "heatindex_f": 97.2 },
    "aqi": {
      "co": 233.8, "no2": 12.4, "o3": 42.1,
      "so2": 6.3, "pm2_5": 18.6, "pm10": 27.4
    }
  }
}
```

---

## Error Reference

| Status | Meaning |
|--------|---------|
| `200`  | Request successful |
| `201`  | Resource created successfully |
| `400`  | Missing or invalid parameters |
| `401`  | Missing, invalid, or expired token |
| `404`  | Resource not found |
| `409`  | Email already registered |
| `500`  | Internal server error |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (expires in 24h) |
| Password hashing | SHA-256 via Node `crypto` |
| Weather data | [WeatherAPI](https://www.weatherapi.com/) |
| Logging | Morgan |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the backend listens on (default `8080`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `WEATHER_API_KEY` | API key from weatherapi.com |

---

## Frontend Configuration

If you change the backend port or route prefix, update line 2 of `frontend/src/api.js`:

```js
const BASE_URL = "http://localhost:8080/api/v1";
```

---

## License

MIT