const ClientRouter = require('./client');
const StaffRouter = require('./staff');
const FlightRouter = require('./Flight');
const HoaDonRouter = require('./HoaDon');
const LoginRouter = require('./Login');

const route = (app) => {
    app.use('/hoadon', HoaDonRouter);
    app.use('/flight', FlightRouter);
    app.use('/staff', StaffRouter);
    app.use('/login', LoginRouter);
    app.use('/', ClientRouter);
};

module.exports = route;
