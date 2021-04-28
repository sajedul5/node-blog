const Users = require('../models/User');


const profile = async (req, res) => {
    const id = req.id;
    const user = await Users.findOne({_id: id});
    res.render('profile', {title: 'Profile', signin: true, user});
}


const signout = (req, res) => {
    req.session.destroy((err) => {
        if(!err){
            res.redirect('/signin');
        }
    })
}


module.exports = {
    profile,
    signout
}