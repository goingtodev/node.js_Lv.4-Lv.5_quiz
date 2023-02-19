import express from 'express';
import PostController from '../controller/posts.js';
import AuthClass from '../middleware/auth.js';
const postController = new PostController();
const router = express.Router();
const authClass = new AuthClass();

// 게시글 작성
router.post('/', authClass.isAuth, postController.createPost);

// 게시글 조회
router.get('/', postController.getAllPost);

// 게시글 상세 조회
router.get('/:postId', postController.getAllByIdPost);

// 게시글 수정
router.put('/:postId', authClass.isAuth, postController.updatePost);

// 게시글 삭제
router.delete('/:postId', authClass.isAuth, postController.deletePost);

export default router;
