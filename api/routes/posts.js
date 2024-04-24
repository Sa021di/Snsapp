import express from "express";
import { getPosts, addPost, deletePost, editPost, getPostsByUser } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:userId", getPostsByUser);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", editPost);

export default router;
