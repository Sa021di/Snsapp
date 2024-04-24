import express from "express";
import { getCommentLikes, addCommentLike, deleteCommentLike } from "../controllers/commentLike.js";

const router = express.Router();

router.get('/:commentId/likes', getCommentLikes);
router.post('/:commentId/likes', addCommentLike);
router.delete('/:commentId/likes', deleteCommentLike);


export default router;
