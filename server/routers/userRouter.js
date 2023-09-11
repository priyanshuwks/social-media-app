const  userController  = require('../controllers/userController');
const requireUser = require('../middlewares/requireUser');

const router = require('express').Router();

router.post('/follow', requireUser, userController.followOrUnfollowUser);
router.get('/getPostOfFollowing', requireUser, userController.getPostsOfFollowing);
router.get('/myposts', requireUser, userController.getMyPostsController);
router.get('/userPosts',requireUser, userController.getUserPostsController);
router.delete('/', requireUser, userController.deleteMyProfileController);

module.exports = router;