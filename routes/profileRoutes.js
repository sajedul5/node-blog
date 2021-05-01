
const express = require('express');
const router = express.Router();


//Profile Controller
const {profile, signout} = require('../controllers/profileController');
const {auth} = require('../middlewares/auth');


router.get('/profile', auth, profile);
router.get('/signout', signout);



module.exports = router;