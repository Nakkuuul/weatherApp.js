# API Documentation

## Overview

A RESTful API providing user authentication and real-time weather data. Built with **Express.js** and **MongoDB**, using **JWT** for protected routes and **WeatherAPI** for weather data.

- **Base URL:** `http://localhost:<PORT>/api`
- **Authentication:** Bearer Token (JWT)
- **Content-Type:** `application/json`

---

## Authentication

Protected endpoints require a valid JWT token in the `Authorization` header.

```
Authorization: Bearer <token>
```

Tokens are issued upon successful login and expire after **24 hours**.

---

## Endpoints

### 1. Register User

Create a new user account.

```
POST /register
```

#### Request Body

| Field      | Type     | Required | Description          |
|------------|----------|----------|----------------------|
| `email`    | `string` | Yes      | Valid email address  |
| `password` | `string` | Yes      | User's password      |

#### Example Request

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Responses

**`201 Created` — Registration successful**
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

**`400 Bad Request` — Missing fields**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**`409 Conflict` — Email already in use**
```json
{
  "success": false,
  "message": "Email already exist"
}
```

**`500 Internal Server Error`**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "<error details>"
}
```

---

### 2. Login

Authenticate an existing user and receive a JWT token.

```
POST /login
```

#### Request Body

| Field      | Type     | Required | Description         |
|------------|----------|----------|---------------------|
| `email`    | `string` | Yes      | Registered email    |
| `password` | `string` | Yes      | User's password     |

#### Example Request

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Responses

**`200 OK` — Login successful**
```json
{
  "success": true,
  "message": "User Validated Successfully",
  "user": {
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**`400 Bad Request` — Missing fields**
```json
{
  "success": false,
  "message": "Email and Password both are required"
}
```

**`401 Unauthorized` — Wrong password**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**`404 Not Found` — User does not exist**
```json
{
  "success": false,
  "message": "User not found"
}
```

**`500 Internal Server Error`**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "<error details>"
}
```

---

### 3. Get Weather

Fetch real-time weather data for a specified city. **Requires authentication.**

```
GET /getWeather
```

#### Headers

| Header          | Value                   | Required |
|-----------------|-------------------------|----------|
| `Authorization` | `Bearer <jwt_token>`    | Yes      |
| `Content-Type`  | `application/json`      | Yes      |

#### Request Body

| Field      | Type     | Required | Description                       |
|------------|----------|----------|-----------------------------------|
| `cityName` | `string` | Yes      | Name of the city to get weather for |

#### Example Request

```json
{
  "cityName": "Mumbai"
}
```

#### Responses

**`200 OK` — Weather data retrieved**
```json
{
  "success": true,
  "data": {
    "dataOf": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    },
    "temperature": {
      "temperature_c": 31.0,
      "temperature_f": 87.8
    },
    "wind": {
      "wind_mph": 8.1,
      "wind_kph": 13.0,
      "wind_degree": 290
    },
    "pressure": {
      "pressure_mb": 1008.0,
      "pressure_in": 29.77
    },
    "precipitation": {
      "precipitation_mm": 0.0,
      "precipitation_in": 0.0
    },
    "humidity": 74,
    "feels_like": {
      "feelslike_c": 36.2,
      "feelslike_f": 97.2
    },
    "heat_index": {
      "heatindex_c": 36.2,
      "heatindex_f": 97.2
    },
    "aqi": {
      "co": 233.8,
      "no2": 12.4,
      "o3": 42.1,
      "so2": 6.3,
      "pm2_5": 18.6,
      "pm10": 27.4
    }
  }
}
```

**`400 Bad Request` — Missing city name**
```json
{
  "success": false,
  "message": "City name is required"
}
```

**`401 Unauthorized` — Missing or malformed token**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**`401 Unauthorized` — Expired or invalid token**
```json
{
  "success": false,
  "message": "Invalid or Expired Token"
}
```

**`404 Not Found` — City not found**
```json
{
  "success": false,
  "message": "City not found"
}
```

**`500 Internal Server Error`**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "<error details>"
}
```

---

## Weather Response Fields

| Field                          | Type     | Description                                |
|-------------------------------|----------|--------------------------------------------|
| `dataOf.city`                 | `string` | City name                                  |
| `dataOf.state`                | `string` | State / region                             |
| `dataOf.country`              | `string` | Country name                               |
| `temperature.temperature_c`   | `number` | Temperature in Celsius                     |
| `temperature.temperature_f`   | `number` | Temperature in Fahrenheit                  |
| `wind.wind_mph`               | `number` | Wind speed in miles per hour               |
| `wind.wind_kph`               | `number` | Wind speed in kilometres per hour          |
| `wind.wind_degree`            | `number` | Wind direction in degrees                  |
| `pressure.pressure_mb`        | `number` | Atmospheric pressure in millibars          |
| `pressure.pressure_in`        | `number` | Atmospheric pressure in inches             |
| `precipitation.precipitation_mm` | `number` | Precipitation in millimetres            |
| `precipitation.precipitation_in` | `number` | Precipitation in inches                 |
| `humidity`                    | `number` | Relative humidity percentage               |
| `feels_like.feelslike_c`      | `number` | Feels-like temperature in Celsius          |
| `feels_like.feelslike_f`      | `number` | Feels-like temperature in Fahrenheit       |
| `heat_index.heatindex_c`      | `number` | Heat index in Celsius                      |
| `heat_index.heatindex_f`      | `number` | Heat index in Fahrenheit                   |
| `aqi.co`                      | `number` | Carbon monoxide (μg/m³)                    |
| `aqi.no2`                     | `number` | Nitrogen dioxide (μg/m³)                   |
| `aqi.o3`                      | `number` | Ozone (μg/m³)                              |
| `aqi.so2`                     | `number` | Sulphur dioxide (μg/m³)                    |
| `aqi.pm2_5`                   | `number` | Particulate matter < 2.5μm (μg/m³)        |
| `aqi.pm10`                    | `number` | Particulate matter < 10μm (μg/m³)         |

---

## Error Reference

| Status Code | Meaning                                          |
|-------------|--------------------------------------------------|
| `200`       | Request successful                               |
| `201`       | Resource created successfully                    |
| `400`       | Bad request — missing or invalid parameters      |
| `401`       | Unauthorized — missing, invalid, or expired token|
| `404`       | Resource not found                               |
| `409`       | Conflict — resource already exists               |
| `500`       | Internal server error                            |

---

## Security Notes

- Passwords are hashed using **SHA-256** before storage.
- JWT tokens expire after **24 hours** and must be re-issued via `/login`.
- The `/getWeather` endpoint validates the JWT on every request.

---

## Environment Variables

| Variable         | Description                          |
|------------------|--------------------------------------|
| `WEATHER_API_KEY`| API key from [WeatherAPI](https://www.weatherapi.com/) |
| `JWT_SECRET`     | Secret key used to sign JWT tokens   |
| `MONGO_URI`      | MongoDB connection string            |
| `PORT`           | Server port (default: `3000`)        |