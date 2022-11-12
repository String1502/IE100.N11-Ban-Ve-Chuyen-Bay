const ClientRouter = require('./client');
const StaffRouter = require('./staff');
const FlightRouter = require('./Flight');
const HoaDonRouter = require('./HoaDon');

const route = (app) => {
    app.use('/hoadon', HoaDonRouter);
    app.use('/flight', FlightRouter);
    app.use('/staff', StaffRouter);
    app.use('/', ClientRouter);
};

module.exports = route;
