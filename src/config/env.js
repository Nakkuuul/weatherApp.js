import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if(!PORT) {
    throw new Error("PORT is not available in .env file");
}

if(!WEATHER_API_KEY) {
    throw new Error("WEATHER_API_KEY is not available in .env file");
}

export default {
    PORT,
    WEATHER_API_KEY
};