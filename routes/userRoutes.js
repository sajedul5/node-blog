const express = require('express');
const router = express.Router();

//User Controller
const {loadSignup, loadSignin, signupValidation, postRegister, postSignin, signinValidation} = require('../controllers/userController');
const {stopSignin} = require('../middlewares/auth');

router.get('/' , stopSignin, loadSignup);
router.get('/signin' , stopSignin, loadSignin);
router.post('/signup', signupValidation, postRegister );
router.post('/postSignin', signinValidation, postSignin );



module.exports = router;