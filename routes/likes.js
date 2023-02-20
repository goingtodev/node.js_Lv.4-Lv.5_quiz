import express from 'express';
import LikeController from '../controller/likes.js';
import AuthClass from '../middleware/auth.js';
const likeController = new LikeController();
const router = express.Router();
const authClass = new AuthClass();

// 게시글 좋아요
router.put('/posts/:postId/like', authClass.isAuth, likeController.updateLike);

// 좋아요 게시글 조회
router.get('/posts/like', likeController.getAllLike);

export default router;
