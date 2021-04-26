const express = require('express');
const router = express.Router();

//User Controller
const {loadSignup, loadSignin, registerValidation, postRegister} = require('../controllers/userController');

router.get('/' , loadSignup);
router.get('/login' , loadSignin);
router.post('/register', registerValidation, postRegister );


module.exports = router;