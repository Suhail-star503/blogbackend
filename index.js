// Importing env
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import path from 'path';

// Modules Imported
import express from 'express';

// Routers Imported
import cors from 'cors';
import cookieParser from 'cookie-parser';
import blogRouter from "./src/features/Blog/Routes/blog.routes.js";


// Middlewares
import { errorHandlerMiddleware } from './src/middlewares/error-handler.middleware.js';
import connectUsingMongoose from './config/mongooseConfig.js';


// Server Created
const app = express();
app.use(cookieParser());

// Json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up cors to allow us to accept requests from our client
app.use(cors());

app.use('/uploads', express.static(path.join(path.resolve(), 'src/uploads')));
// Routes related to all features
app.use('/api/blog', blogRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is up and running",
    });
});

// Error handler
app.use(errorHandlerMiddleware);

// 404 Route middelware handles 404 requests
app.use((req, res) => {
    res.status(404).send("API not found please give valid API.");
});

// Server is listening here
app.listen('3000', () => {
    console.log("Server is listening on: localhost:3000");
    connectUsingMongoose();
});