import express from "express";
import { getPostDetails } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/:postId", getPostDetails);

export default postRouter;
