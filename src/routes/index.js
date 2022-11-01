const notLoginRouter = require('./not_login');
const loggedinClientRouter = require('./loggedin_client');
const loggedinStaffRouter = require('./loggedin_staff');

const route = (app) => {
    app.use('/client', loggedinClientRouter);
    app.use('/staff', loggedinStaffRouter);
    app.use('/', notLoginRouter);
};

module.exports = route;
