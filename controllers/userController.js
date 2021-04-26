const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const Users = require('../models/User');


const loadSignup = (req, res) => {
    const title = 'Create new account';
    const errors = [];
    res.render('register', {title, errors, inputs: {}});
}


const loadSignin = (req, res) => {
    const title = 'User Login'
    res.render('login', {title});
}


const registerValidation =  [
    check('name').isLength({min: 3}).withMessage('Name is required & must be 3 characters long'),
    check('email').isEmail().withMessage('Valid email is required.'),
    check('password').isLength({min: 6}).withMessage('Password must be 6 characters long'),
] 


const postRegister = async (req, res) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const title = 'Create new account';
        res.render('register', {title, errors: errors.array(), inputs: req.body });
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
                    res.redirect('/login');
                }catch (err){
                    console.log(err.message);
                }

            }else{
                res.render('register', {title: 'Create new account', errors: [{msg: 'Email is alreay exsit'}], inputs: req.body });
            }
        }catch (err){
            console.log(err.message);
        }
    }
    
}




module.exports = {
    loadSignup,
    loadSignin,
    registerValidation,
    postRegister,
}