const ClientRouter = require('./client');
const StaffRouter = require('./staff');
const FlightRouter = require('./Flight');
const HoaDonRouter = require('./HoaDon');
const LoginRouter = require('./Login');
const QuyDinhRouter = require('./QuyDinh');
const PhanQuyenRouter = require('./PhanQuyen');
const NhanLichRouter = require('./NhanLich');
const BaoCaoRouter = require('./BaoCao');
const HinhThucThanhToanRouter = require('./HinhThucThanhToan');

const route = (app) => {
    app.use('/thanhtoan', HinhThucThanhToanRouter);
    app.use('/staff/nhanlich', NhanLichRouter);
    app.use('/staff/quydinh', QuyDinhRouter);
    app.use('/staff/phanquyen', PhanQuyenRouter);
    app.use('/staff/baocao', BaoCaoRouter);
    app.use('/hoadon', HoaDonRouter);
    app.use('/flight', FlightRouter);
    app.use('/staff', StaffRouter);
    app.use('/login', LoginRouter);
    app.use('/', ClientRouter);
};

module.exports = route;
