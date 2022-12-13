const ClientRouter = require('./client');
const StaffRouter = require('./staff');
const FlightRouter = require('./Flight');
const HoaDonRouter = require('./HoaDon');
const LoginRouter = require('./Login');
const authRouter = require('./auth');
const QuyDinhRouter = require('./QuyDinh');
const PhanQuyenRouter = require('./PhanQuyen');

const route = (app) => {
    app.use('/staff/quydinh', QuyDinhRouter);
    app.use('/staff/phanquyen', PhanQuyenRouter);
    app.use('/hoadon', HoaDonRouter);
    app.use('/flight', FlightRouter);
    app.use('/staff', StaffRouter);
    app.use('/login', LoginRouter);
    app.use('/auth', authRouter);
    app.use('/', ClientRouter);
};

module.exports = route;
