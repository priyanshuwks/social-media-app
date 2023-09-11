const { success, error } = require("../utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");

const createPostController = async (req, res) => {
  try {
    const { caption } = req.body;
    const owner = req._id; //req takes the id from the middleware when decoded.

    const user = await User.findById(req._id);

    const post = await Post.create({
      owner,
      caption,
    });

    user.posts.push(post._id);
    await user.save();

    return res.send(success(201, post));
  } catch (err) {
    console.log(err);
    res.send(error(500, err.message));
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUserId = req._id;

    const post = await Post.findById(postId);
    // console.log('found post', post._id);

    if (!post) {
      res.send(error(404, "Post not found"));
    }
    // console.log('ram1');
    // console.log('curr user id: is: ', currUserId)
    //post unlike logic
    if (post.likes.includes(currUserId)) {
      // console.log('ram2')
      const index = post.likes.indexOf(currUserId); // if curr user is present in the like array
      post.likes.splice(index, 1); // then remove the curr user Id from the like array.
      await post.save();
      return res.send(success(200, "post unliked"));
    } else {
      //post like logic
      //   console.log('entered else codn')
      post.likes.push(currUserId);
      await post.save();
      return res.send(success(200, "post liked"));
    }
  } catch (err) {
    console.log("entered catch block");
    console.log(err);
    return res.send(error(500, err.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const currUserId = req._id;

    const post = await Post.findById(postId);
    if (!post) {
      res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currUserId) {
      return res.send(error(403, "Only owners can update their posts"));
    }

    if (caption) {
      post.caption = caption;
    }
    await post.save();
    return res.send(success(200, post));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUserId = req._id;

    const post = await Post.findById(postId);
    const currUser = await User.findById(currUserId);

    if (!post) {
      res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currUserId) {
      return res.send(error(403, "Only owners can delte their posts"));
    }

    const index = currUser.posts.indexOf(postId);
    currUser.posts.splice(index, 1);
    await currUser.save();
    await post.deleteOne();

    return res.send(success(200, "Post deleted successfully!"));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

module.exports = {
  createPostController,
  likeAndUnlikePost,
  updatePostController,
  deletePostController,
};
