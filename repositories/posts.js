import {
  Posts,
  INCLUDE_USER,
  DETAIL_USER,
  ORDER_DESC,
} from '../model/posts.js';
import { User } from '../model/auth.js';

class PostRepository {
  postCreate = async (title, content, userId) => {
    return await Posts.create({ title, content, userUserId: userId });
  };
  getAll = async () => {
    return await Posts.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
  };
  findByUsername = async (nickname) => {
    return await User.findOne({ where: { nickname: nickname } });
  };
  getById = async (postId) => {
    return await Posts.findOne({ where: { postId }, ...DETAIL_USER });
  };
  postUpdate = async (postId, title, content) => {
    return await Posts.findByPk(postId, DETAIL_USER).then((post) => {
      (post.title = title), (post.content = content);
      return post.save();
    });
  };
  postRemove = async (postId) => {
    return Posts.findByPk(postId).then((post) => {
      return post.destroy();
    });
  };
}
export default PostRepository;
