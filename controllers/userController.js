const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/User');


const loadSignup = (req, res) => {
    const title = 'Create new account';
    const errors = [];
    res.render('register', {title, errors, inputs: {}, signin: false});
}


const loadSignin = (req, res) => {
    const title = 'User Signin'
    res.render('login', {title, errors: [], inputs: {}, signin: false});
}

const signinValidation =  [
    check('email').not().isEmpty().withMessage('Valid email is required.'),
    check('password').not().isEmpty().withMessage('Password is required'),
]


const postSignin = async (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('login', {title: 'User Signin', errors: errors.array(), inputs: req.body, signin: false });
    }else{
        const checkEmail = await Users.findOne({email});
        if(checkEmail !== null){
            const id = checkEmail._id;
            const dbPassword = checkEmail.password;
            const passwordVerify = await bcrypt.compare(password, dbPassword);
            if(passwordVerify){
                // Create Token
                const token = jwt.sign({userID: id}, process.env.JWT_SCRECT, {expiresIn: '7d'});
                //console.log('token', token);
                // Create session variable
                req.session.user = token;
                res.redirect('/profile');

            }else{
                res.render('login', {title: 'User Signin', errors: [{msg: 'Your password is wrong!'}], inputs: req.body, signin: false });
            }
        }else{
            res.render('login', {title: 'User Signin', errors: [{msg: 'Email is not found!'}], inputs: req.body, signin: false });
        }
    }
}


const signupValidation =  [
    check('name').isLength({min: 3}).withMessage('Name is required & must be 3 characters long'),
    check('email').isEmail().withMessage('Valid email is required.'),
    check('password').isLength({min: 6}).withMessage('Password must be 6 characters long'),
] 


const postRegister = async (req, res) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const title = 'Create new account';
        res.render('register', {title, errors: errors.array(), inputs: req.body, signin: false });
    }else{
        try{
            const userEmail = await Users.findOne({email});
            if(userEmail === null){
                const salt = await bcrypt.genSalt(10);                
                const hashed = await bcrypt.hash(password, salt);
                console.log(salt);
                const newUser = new Users({
                    name: name,
                    email: email,
                    password: hashed
                });
                try{
                    const createUser = await newUser.save();
                    req.flash('success', 'Your account has been created successfully!');
                    res.redirect('/signin');
                }catch (err){
                    console.log(err.message);
                }

            }else{
                res.render('register', {title: 'Create new account', errors: [{msg: 'Email is alreay exsit'}], inputs: req.body, signin: false });
            }
        }catch (err){
            console.log(err.message);
        }
    }
    
}




module.exports = {
    loadSignup,
    loadSignin,
    signupValidation,
    postRegister,
    postSignin,
    signinValidation,
}