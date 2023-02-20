import express from 'express';
import CommentController from '../controller/comments.js';
import AuthClass from '../middleware/auth.js';
const commentController = new CommentController();
const router = express.Router();
const authClass = new AuthClass();

// 댓글 작성
router.post('/comments', authClass.isAuth, commentController.createComment);

// 댓글 조회
router.get('/comments', commentController.getAllComment);

// 댓글 수정
router.put(
  '/comments/:commentId',
  authClass.isAuth,
  commentController.updateComment
);

// 댓글 삭제
router.delete(
  '/comments/:commentId',
  authClass.isAuth,
  commentController.deleteComment
);

export default router;
