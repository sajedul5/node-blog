const  express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

//Load static files
app.use(express.static('./views'));

//Set ejs
app.set('view engine', 'ejs');

//Routes
app.get('/' , (req, res) => {
    title = 'Create new account'
    res.render('register', {title});
});
app.get('/login' , (req, res) => {
    title = 'User Login'
    res.render('login', {title});
});


//create server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});