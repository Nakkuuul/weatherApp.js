import express from 'express';
import morgan from 'morgan';

import authRouter from '../src/routes/auth.routes.js'

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

app.use("/api/v1/auth", authRouter);

export default app;
