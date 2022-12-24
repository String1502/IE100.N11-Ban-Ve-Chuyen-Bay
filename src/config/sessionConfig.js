const session = require('express-session');
require('dotenv').config();

let configSession = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
        }),
    );
};

export default configSession;
