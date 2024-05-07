
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from '../db/dbconection.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userrouter from "../routes/user.routes.js";

// Routes
app.use("/api/v1/users", userrouter);
 

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});

// export { app }