import { asyncHandler } from "../utils/asyncHanderl.js";
import jwt from "jsonwebtoken"

import { User } from "../modals/user.modal.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from the request headers or cookies
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        
        // Check if token is provided
        if (!token) {
            return res.status(401).json({ error: "Unauthorized request: Token not provided" });
        }

        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if user exists in database
        const user = await User.findById(decodedToken?._id).select("refreshToken");
        if (!user) {
            return res.status(404).json({ error: "Invalid access token: User not found" });
        }

        // Set user object in request for further processing
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid access token: JWT malformed" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});