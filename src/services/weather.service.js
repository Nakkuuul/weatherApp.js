import axios from "axios";
import env from "../config/env.js";

const BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeather(cityName) {
  try {
    const API_KEY = env.WEATHER_API_KEY;

    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: cityName,
        aqi: "yes",
        pollen: "no",
        lang: "English",
      },
    });

    return {
      dataOf: {
        city: response.data.location.name,
        state: response.data.location.region,
        country: response.data.location.country,
      },

      temperature: {
        temperature_c: response.data.current.temp_c,
        temperature_f: response.data.current.temp_f,
      },

      wind: {
        wind_mph: response.data.current.wind_mph,
        wind_kph: response.data.current.wind_kph,
        wind_degree: response.data.current.wind_degree,
      },

      pressure: {
        pressure_mb: response.data.current.pressure_mb,
        pressure_in: response.data.current.pressure_in,
      },

      precipitation: {
        precipitation_mm: response.data.current.precip_mm,
        precipitation_in: response.data.current.precip_in,
      },

      humidity: response.data.current.humidity,

      feels_like: {
        feelslike_c: response.data.current.feelslike_c,
        feelslike_f: response.data.current.feelslike_f,
      },

      heat_index: {
        heatindex_c: response.data.current.heatindex_c,
        heatindex_f: response.data.current.heatindex_f,
      },

      aqi: {
        co: response.data.current.air_quality.co,
        no2: response.data.current.air_quality.no2,
        o3: response.data.current.air_quality.o3,
        so2: response.data.current.air_quality.so2,
        pm2_5: response.data.current.air_quality.pm2_5,
        pm10: response.data.current.air_quality.pm10,
      },
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Failed to fetch weather data",
    );
  }
}
