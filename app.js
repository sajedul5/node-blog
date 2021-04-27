const  express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('express-flash');
require('dotenv').config();
const connect = require('./models/db');
const userRouters = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

//DB Connection;
connect();

// Express session middleware
const store = new MongoDBStore({
    uri: process.env.DB,
    collection : 'sessions'
});

//Express Session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: store
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
app.use(profileRoutes);

//create server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});