const formidable = require('formidable');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const Users = require('../models/User');
const Posts = require('../models/Post');

const postForm = (req, res) => {
    res.render('createPost', {title: 'Create new post', signin: true, errors: [], title:'', body: ''});
}


const storePost = (req, res) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        const errors = [];
        const {title, body} = fields;
        if(title.length === 0) {
            errors.push({msg: 'Title is required!'});
        }
        if(body.length === 0) {
            errors.push({msg: 'Body is required!'});
        }
        
        const imageName = files.image.name;
        const split = imageName.split('.');
        const imageExt = split[split.length - 1].toUpperCase();

        if(files.image.name.length === 0) {
            errors.push({msg: 'Image is required!'});
        }else if(imageExt !== 'JPG' && imageExt !== 'PNG'){
            errors.push({msg: 'Only jpg and png are allowed!'});
        }

        if(errors.length !== 0) {
            res.render('createPost', {title: 'Create new post', signin: true, errors, title, body});
        }else {
            files.image.name = uuidv4() + '.'+ imageExt;
            const oldPath = files.image.path;
            const newPath = __dirname + '/../views/assets/img/' + files.image.name;
            fs.readFile(oldPath, (err, data) => {
                if(!err){
                    fs.writeFile(newPath, data, (err) => {
                        if(!err) {
                            fs.unlink(oldPath, async (err) => {
                                if(!err){
                                    const id = req.id;
                                    try {
                                        const user = await Users.findOne({_id: id});
                                        const name = user.name;
                                        const newPost = new Posts({
                                            userID: id,
                                            title,
                                            body,
                                            image:files.image.name,
                                            userName:name
                                        });
                                        
                                        try {
                                            const result = await newPost.save();
                                            if(result){
                                                res.send('post created!');
                                            }

                                        }catch (err){
                                            res.send(err.msg);
                                        }

                                    }catch (err){
                                        res.send(err.msg);
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}


const posts = (req, res) => {
    res.render('Post', {title: 'Post', signin: true});
}


module.exports = {
    postForm,
    storePost,
    posts
}