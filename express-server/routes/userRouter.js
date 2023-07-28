import express from "express";
import { getUserDetails } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/:username", getUserDetails);
userRouter.get("/:username/*", getUserDetails);

export default userRouter;
