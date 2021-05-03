const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    if(req.session.user){
        const token = req.session.user;
        const verified = jwt.verify(token, process.env.JWT_SCRECT);
        if(!verified){
           return res.redirect('/signin');
        }else{
            req.id = verified.userID;
        }
    }else{
       return res.redirect('/signin');
    }
    next()
}


const stopSignin = (req, res, next) => {
    if(req.session.user){
        const token = req.session.user;
        const verified = jwt.verify(token, process.env.JWT_SCRECT);
        if(verified){
           return res.redirect('/profile');
        }
    }
    next()
}

module.exports = {
    auth,
    stopSignin,
}