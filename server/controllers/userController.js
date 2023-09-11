const User = require("../models/User");
const Post = require("../models/Post");
const { success, error } = require("../utils/responseWrapper");

const followOrUnfollowUser = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const currUserId = req._id;

    if (userIdToFollow === currUserId) {
      res.send(error(409, "can not follow yourself"));
    }

    const toBeFollowedUser = await User.findById(userIdToFollow);
    const currUser = await User.findById(currUserId);

    if (!toBeFollowedUser) {
      return res.send(error(404), "User to be followed not found");
    }

    //already following case:
    if (currUser.followings.includes(userIdToFollow)) {
      const index = currUser.followings.indexOf(userIdToFollow);
      currUser.followings.splice(index, 1);

      const indx = toBeFollowedUser.followers.indexOf(currUser);
      toBeFollowedUser.followers.splice(indx, 1);

      await currUser.save();
      await toBeFollowedUser.save();

      return res.send(success(200, "User unfollowed"));
    } else {
      currUser.followings.push(userIdToFollow);
      await currUser.save();

      toBeFollowedUser.followers.push(currUserId);
      await toBeFollowedUser.save();

      res.send(success(200, "User followed"));
    }
  } catch (err) {
    console.log(err);
    res.send(error(500, err.message));
  }
};

const getPostsOfFollowing = async (req, res) => {
  try {
    const currUserId = req._id;

    const currUser = await User.findById(currUserId);

    const posts = await Post.find({
      owner: {
        $in: currUser.followings,
      },
    });

    res.send(success(200, posts));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const getMyPostsController = async (req, res) => {
  try {
    const currUserId = req._id;

    const currUser = await User.findById(currUserId);
    if (!currUser) {
      return res.send(error(404, "The user does not exists"));
    }
    const posts = currUser.posts;

    if (!posts) {
      return res.send(error(404, "No Posts Found"));
    } else {
      return res.send(success(200, posts));
    }
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const getUserPostsController = async (req, res) => {
  try {
    //const currUserId = req._id;
    const {idOfOtherUser} = req.body;

    const otherUser = await User.findById(idOfOtherUser);
    if (!otherUser) {
      return res.send(
        error(404, "The user you are looking for does not exists.")
      );
    }

    const postsOfOtherUser = otherUser.posts;

    if (!postsOfOtherUser) {
      return res.send(
        error(404, "No posts found for the user you are searching in.")
      );
    } else {
      return res.send(success(200, postsOfOtherUser));
    }
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const deleteMyProfileController = async (req, res) => {
    const currUserId = req._id;

    //updating the likes in the posts liked by the currUser.
    const postsLikedByThisUser = await Post.find({
        likes : {
            '$in' : currUserId
        }
    })
    console.log('posts like byt eh user')
    console.log(postsLikedByThisUser);
}

module.exports = {
  followOrUnfollowUser,
  getPostsOfFollowing,
  getMyPostsController,
  getUserPostsController,
  deleteMyProfileController
};
