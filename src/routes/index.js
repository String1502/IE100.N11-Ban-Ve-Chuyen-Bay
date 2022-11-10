const ClientRouter = require('./client');
const StaffRouter = require('./staff');
const FlightRouter = require('./Flight');

const route = (app) => {
    app.use('/flight', FlightRouter);
    app.use('/staff', StaffRouter);
    app.use('/', ClientRouter);
};

module.exports = route;
