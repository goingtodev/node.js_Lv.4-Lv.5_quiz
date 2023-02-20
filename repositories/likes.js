import { Likes } from '../model/likes.js';
import { LIKE_USER, Posts } from '../model/posts.js';

class LikeRepository {
  createPostinLike = async (postId, userId) => {
    return await Likes.create({ postPostId: postId, userUserId: userId });
  };

  deletePostinLike = async (postId, userId) => {
    return await Likes.destroy({
      where: { postPostId: postId, userUserId: userId },
    });
  };

  findPostinLike = async (postId) => {
    return await Likes.findOne({ postPostId: postId });
  };
  getById = async (postId) => {
    return await Posts.findByPk(postId);
  };
  getAllLikes = async () => {
    return await Posts.findAll({ ...LIKE_USER, group: 'postId' });
  };
}
export default LikeRepository;
