const notLoginRouter = require('./client');
const loggedinStaffRouter = require('./staff');
const FlightRouter = require('./Flight');

const route = (app) => {
    app.use('/flight', FlightRouter);
    app.use('/staff', loggedinStaffRouter);
    app.use('/', notLoginRouter);
};

module.exports = route;
