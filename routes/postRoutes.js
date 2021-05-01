const express = require('express');

const router = express.Router();

const {postForm, storePost, posts} = require('../controllers/postsController');
const {auth} = require('../middlewares/auth');

router.get('/createPost', auth, postForm);
router.post('/createPost', auth, storePost);
router.get('/posts', auth, posts);

module.exports = router;