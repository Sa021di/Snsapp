import express from 'express';
import { getReplies, addReply} from '../controllers/reply.js';

const router = express.Router();


router.get('/', getReplies);
router.post('/', addReply);


export default router;