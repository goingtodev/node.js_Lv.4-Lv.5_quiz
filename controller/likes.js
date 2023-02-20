import LikeService from '../services/likes.js';

class LikeController {
  likeService = new LikeService();

  updateLike = async (req, res) => {
    const { postId } = req.params;
    await this.likeService.updateLikeService(req, res, postId);
  };

  getAllLike = async (req, res) => {
    await this.likeService.getAllLikeService(res);
  };
}
export default LikeController;
