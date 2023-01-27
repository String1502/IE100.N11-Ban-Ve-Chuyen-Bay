import db from '../models/index';
const { QueryTypes, where } = require('sequelize');
import HoaDonController from './HoaDonController';
import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    onlyNumber,
    showToast,
} from '../public/javascript/start.js';

const vnp_TmnCode = 'SLC8HSYX';
const vnp_HashSecret = 'WEDDYNUFAGHXDZZYACHJPKQVIPNGUKCW';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
var vnp_ReturnUrl = 'http://localhost:8080/thanhtoan/VNPAY_LayKetQuaThanhToan';

class HinhThucThanhToanController {
    // Đưa cho VNPay
    async VNPAY_ChuyenHuongThanhToan(req, res, next) {
        try {
            var ipAddr =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            var tmnCode = vnp_TmnCode;
            var secretKey = vnp_HashSecret;
            var vnpUrl = vnp_Url;

            var date = new Date();
            var yyyy = date.getFullYear();
            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            var HHmmss =
                '' +
                numberSmallerTen(date.getHours()) +
                numberSmallerTen(date.getMinutes()) +
                numberSmallerTen(date.getSeconds());
            var createDate = '' + yyyy + numberSmallerTen(mm) + numberSmallerTen(dd) + HHmmss;

            // -- Start: Điền dữ liệu của mình dô --
            var orderId = req.body.MaHoaDon; // mã hóa đơn không trùng ở DB [Mã hóa đơn của mình]

            var amount = parseInt(req.body.TongTien); // Số tiền

            var orderInfo = req.body.NoiDungThanhToan; // Nội dung thanh toán, tiếng việt không dấu

            var returnUrl = vnp_ReturnUrl; // URL trả cho khách khi kết thúc thanh toán, lưu ý VNPay sẽ dùng GET cho URL này
            //-- End: Hết điền --

            var bankCode = 'NCB'; // Mã ngân hàng để trống nha! Khi demo thì = NCB

            var orderType = 'billpayment'; // orderType = 'billpayment'

            var locale = 'vn'; // Ngôn ngữ

            var currCode = 'VND'; // Đơn vị tiền tệ

            // ----- Đừng đụng khúc dưới!!!!
            var vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Amount'] = (amount * 100).toString();
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = orderType;
            vnp_Params['vnp_Locale'] = locale;
            if (bankCode != '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;

            vnp_Params = sortObject(vnp_Params);

            var querystring = require('qs');
            var signData = querystring.stringify(vnp_Params, { encode: false });
            var crypto = require('crypto');
            var hmac = crypto.createHmac('sha512', secretKey);
            var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
            res.redirect(vnpUrl);
        } catch (err) {
            console.log(err);
        }
    }

    // VNPay trả về
    async VNPAY_LayKetQuaThanhToan(req, res, next) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var secretKey = vnp_HashSecret;

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');

        // --------- Sửa

        var KetQuaThanhToan = { ThanhCong: false };

        var MaHoaDonHienThi = vnp_Params['vnp_TxnRef'].toString();
        // [MaUser]-[MaHoaDon]-[MaHangVe] // nếu MaUser = null thì MaUser = GUEST
        var MaHoaDon = MaHoaDonHienThi.split('-')[1];
        var MaUser = MaHoaDonHienThi.split('-')[0];
        if (MaUser == 'GUEST') {
            MaUser = null;
        }

        if (secureHash === signed) {
            var rspCode = vnp_Params['vnp_ResponseCode'].toString();
            if (rspCode == '00') {
                console.log('Thanh toan thanh cong');
                // thanh toán thành công
                var MaHTTT = 'vnpay'; // Coi DB
                var NgayGioThanhToan = new Date();

                // Thanh toán và gửi vé điện tử
                let ThanhToan = await HoaDonController.ThanhToan(MaHoaDon, MaHTTT, NgayGioThanhToan, MaUser);

                if (ThanhToan == 1) {
                    KetQuaThanhToan.ThanhCong = true;
                    KetQuaThanhToan.NgayGioThanhToan =
                        numberSmallerTen(NgayGioThanhToan.getHours()) +
                        ':' +
                        numberSmallerTen(NgayGioThanhToan.getMinutes()) +
                        ' ' +
                        numberSmallerTen(NgayGioThanhToan.getDate()) +
                        '/' +
                        numberSmallerTen(NgayGioThanhToan.getMonth() + 1) +
                        '/' +
                        NgayGioThanhToan.getFullYear();
                }
            }
        }

        if (KetQuaThanhToan.ThanhCong == false) {
            await HoaDonController.HuyHoaDon(MaHoaDon);
        }
        return res.render('client/KetQuaThanhToan', {
            layout: 'client.handlebars',
            KetQuaThanhToanJS: JSON.stringify(KetQuaThanhToan),
        });
    }
}

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

module.exports = new HinhThucThanhToanController();
