const {success, error} = require("../utils/responseWrapper");
const Post = require('../models/Post');
const User = require('../models/User');

const getAllPostsController = async (req, res) => {
  console.log(req._id);
  return res.send(success(200, "These are all the posts"));
};

const createPostController = async (req, res) => {
  try {
    const { caption } = req.body;
    const owner = req._id;

    const user = await User.findById(req._id);

    const post = await Post.create({
      owner,
      caption,
    });

    user.posts.push(post._id);
    await user.save();

    return res.send(success(201, post));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

module.exports = {getAllPostsController, createPostController };
