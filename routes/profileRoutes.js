
const express = require('express');
const router = express.Router();


//Profile Controller
const {profile} = require('../controllers/profileController');


router.get('/profile', profile);


module.exports = router;