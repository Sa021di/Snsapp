import express from 'express';
import { addBookmark, deleteBookmark, getUserBookmarks, checkBookmark } from '../controllers/bookmark.js';

const router = express.Router();

router.post('/add', addBookmark);
router.delete('/delete', deleteBookmark);
router.get('/user', getUserBookmarks);
router.get('/check/:postId', checkBookmark);

export default router;
