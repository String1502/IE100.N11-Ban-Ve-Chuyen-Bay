const notLoginRouter = require('./client');
const loggedinStaffRouter = require('./staff');

const route = (app) => {
    app.use('/staff', loggedinStaffRouter);
    app.use('/', notLoginRouter);
};

module.exports = route;
