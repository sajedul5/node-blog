const  express = require('express');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config();
const connect = require('./models/db');
const userRouters = require('./routes/userRoutes')
const app = express();
const PORT = process.env.PORT || 5000;

//DB Connection;
connect();

//Express Session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
}));

// Flash middleware
app.use(flash());
app.use((req, res, next) => {
res.locals.message = req.flash();
next();
});

//Load static files
app.use(express.static('./views'));
app.use(express.urlencoded({extended: true}));

//Set ejs
app.set('view engine', 'ejs');

//Routes

app.use(userRouters);

//create server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});