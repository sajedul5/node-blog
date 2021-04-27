const express = require('express');
const router = express.Router();

//User Controller
const {loadSignup, loadSignin, signupValidation, postRegister, postSignin, signinValidation} = require('../controllers/userController');

router.get('/' , loadSignup);
router.get('/login' , loadSignin);
router.post('/register', signupValidation, postRegister );
router.post('/postSignin', signinValidation, postSignin );



module.exports = router;