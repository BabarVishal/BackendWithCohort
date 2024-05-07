// user.routes.js

import { Router } from "express";
import { handleRegisterUser, handleGetAllUser, handleLoginUser, logOutUser } from "../Controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middeleware.js";


const router = Router();

router.post(
    "/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    handleRegisterUser
);

router.get(
    "/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    handleGetAllUser
);

router.post(
    "/Login",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    handleLoginUser
);

router.post("/LogOut", verifyJWT,  logOutUser);




export default router;
