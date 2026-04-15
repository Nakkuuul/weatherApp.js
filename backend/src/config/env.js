import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if(!PORT) {
    throw new Error("PORT is not available in .env file");
}

if(!WEATHER_API_KEY) {
    throw new Error("WEATHER_API_KEY is not available in .env file");
}

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not available in .env file");
}

if(!MONGO_URI) {
    throw new Error("MONGO_URI is not available in .env file");
}

export default {
    PORT,
    WEATHER_API_KEY,
    JWT_SECRET,
    MONGO_URI
};