import LikeRepository from '../repositories/likes.js';
import jwt from 'jsonwebtoken';

class LikeService {
  likeRepository = new LikeRepository();

  updateLikeService = async (req, res, postId) => {
    const token = req.cookies.Authorization;
    const splitedToken = token.split(' ')[1];
    const decodedToken = jwt.decode(splitedToken);
    const postFind = await this.likeRepository.getById(postId);
    if (!postFind) {
      return res
        .status(404)
        .json({ errorMessage: ' 게시글이 존재하지 않습니다.' });
    }
    console.log(postFind);
    if (postFind.dataValues.userUserId != decodedToken.userId) {
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }
    const isLike = await this.likeRepository.findPostinLike(postId);
    if (!isLike) {
      await this.likeRepository.createPostinLike(postId, decodedToken.userId);
      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 등록하였습니다.' });
    } else {
      await this.likeRepository.deletePostinLike(postId, decodedToken.userId);
      return res
        .status(200)
        .json({ message: '게시글 좋아요를 취소하였습니다.' });
    }
  };

  getAllLikeService = async (res) => {
    const data = await this.likeRepository.getAllLikes();
    return res.status(200).json({ posts: [data] });
  };
}
export default LikeService;
