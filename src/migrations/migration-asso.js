'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        //HanhKhach - LoaiKhachHang
        await queryInterface.addConstraint('hanhkhach', {
            fields: ['MaLoaiKhach'],
            type: 'foreign key',
            references: {
                table: 'loaikhachhang',
                field: 'MaLoaiKhach',
            },
        });

        //HanhKhach - Ve
        await queryInterface.addConstraint('ve', {
            fields: ['MaHK'],
            type: 'foreign key',
            references: {
                table: 'hanhkhach',
                field: 'MaHK',
            },
        });

        //Ve - MocHanhLy
        await queryInterface.addConstraint('ve', {
            fields: ['MaMocHanhLy'],
            type: 'foreign key',
            references: {
                table: 'mochanhly',
                field: 'MaMocHanhLy',
            },
        });

        //Ve - HoaDon
        await queryInterface.addConstraint('ve', {
            fields: ['MaHoaDon'],
            type: 'foreign key',
            references: {
                table: 'hoadon',
                field: 'MaHoaDon',
            },
        });

        // HoaDon - HtThanhToan
        await queryInterface.addConstraint('hoadon', {
            fields: ['MaHTTT'],
            type: 'foreign key',
            references: {
                table: 'htthanhtoan',
                field: 'MaHTTT',
            },
        });

        // Ve - ChiTietHangVe
        await queryInterface.addConstraint('ve', {
            fields: ['MaCTVe'],
            type: 'foreign key',
            references: {
                table: 'chitiethangve',
                field: 'MaCTVe',
            },
        });

        // HangGhe - ChiTietHangVe
        await queryInterface.addConstraint('chitiethangve', {
            fields: ['MaHangGhe'],
            type: 'foreign key',
            references: {
                table: 'hangghe',
                field: 'MaHangGhe',
            },
        });

        // ChuyenBay - ChiTietHangVe
        await queryInterface.addConstraint('chitiethangve', {
            fields: ['MaChuyenBay'],
            type: 'foreign key',
            references: {
                table: 'chuyenbay',
                field: 'MaChuyenBay',
            },
        });

        // ChiTietChuyenBay - ChuyenBay
        await queryInterface.addConstraint('chitietchuyenbay', {
            fields: ['MaChuyenBay'],
            type: 'foreign key',
            references: {
                table: 'chuyenbay',
                field: 'MaChuyenBay',
            },
        });

        // ChiTietChuyenBay - SanBay
        await queryInterface.addConstraint('chitietchuyenbay', {
            fields: ['MaSBTG'],
            type: 'foreign key',
            references: {
                table: 'sanbay',
                field: 'MaSanBay',
            },
        });

        //ChuyenBay - SanBay
        await queryInterface.addConstraint('chuyenbay', {
            fields: ['MaSanBayDi'],
            type: 'foreign key',
            references: {
                table: 'sanbay',
                field: 'MaSanBay',
            },
        });

        await queryInterface.addConstraint('chuyenbay', {
            fields: ['MaSanBayDen'],
            type: 'foreign key',
            references: {
                table: 'sanbay',
                field: 'MaSanBay',
            },
        });

        //DoanhThu Thang - Nam
        await queryInterface.addConstraint('doanhthuthang', {
            fields: ['Nam'],
            type: 'foreign key',
            references: {
                table: 'doanhthunam',
                field: 'Nam',
            },
        });

        //ChucVu - phanquyen
        await queryInterface.addConstraint('phanquyen', {
            fields: ['MaChucVu'],
            type: 'foreign key',
            references: {
                table: 'chucvu',
                field: 'MaChucVu',
            },
        });

        //NhanVien - ChucVu
        await queryInterface.addConstraint('nhanvien', {
            fields: ['MaChucVu'],
            type: 'foreign key',
            references: {
                table: 'chucvu',
                field: 'MaChucVu',
            },
        });

        //Quyen - Phanquyen
        await queryInterface.addConstraint('phanquyen', {
            fields: ['MaQuyen'],
            type: 'foreign key',
            references: {
                table: 'quyen',
                field: 'MaQuyen',
            },
        });
    },

    async down(queryInterface, Sequelize) {
        //Hanhkhach - Loaikhachhang
        queryInterface.removeConstraint('hanhkhach', {
            fields: ['MaLoaiKhach'],
            type: 'foreign key',
            references: {
                table: 'LoaiKhachHang',
                field: 'MaLoaiKhach',
            },
        });

        //Hanhkhach - Ve
        queryInterface.removeConstraint('ve', {
            fields: ['MaHK'],
            type: 'foreign key',
            references: {
                table: 'hanhkhach',
                field: 'MaHK',
            },
        });

        //Ve - MocHanhLy
        await queryInterface.removeConstraint('ve', {
            fields: ['MaMocHanhLy'],
            type: 'foreign key',
            references: {
                table: 'mochanhly',
                field: 'MaMocHanhLy',
            },
        });

        //Ve - HoaDon
        await queryInterface.removeConstraint('ve', {
            fields: ['MaHoaDon'],
            type: 'foreign key',
            references: {
                table: 'hoadon',
                field: 'MaHoaDon',
            },
        });

        // HoaDon - HtThanhToan
        await queryInterface.removeConstraint('hoadon', {
            fields: ['MaHTTT'],
            type: 'foreign key',
            references: {
                table: 'htthanhtoan',
                field: 'MaHTTT',
            },
        });

        // Ve - ChiTietHangVe
        await queryInterface.removeConstraint('ve', {
            fields: ['MaCTVe'],
            type: 'foreign key',
            references: {
                table: 'chitiethangve',
                field: 'MaCTVe',
            },
        });

        // HangGhe - ChiTietHangVe
        await queryInterface.removeConstraint('chitiethangve', {
            fields: ['MaHangGhe'],
            type: 'foreign key',
            references: {
                table: 'hangghe',
                field: 'MaHangGhe',
            },
        });

        // ChuyenBay - ChiTietHangVe
        await queryInterface.removeConstraint('chitiethangve', {
            fields: ['MaChuyenBay'],
            type: 'foreign key',
            references: {
                table: 'chuyenbay',
                field: 'MaChuyenBay',
            },
        });

        // ChiTietChuyenBay - ChuyenBay
        await queryInterface.removeConstraint('chitietchuyenbay', {
            fields: ['MaChuyenBay'],
            type: 'foreign key',
            references: {
                table: 'chuyenbay',
                field: 'MaChuyenBay',
            },
        });

        // ChiTietChuyenBay - SanBay
        await queryInterface.removeConstraint('chitietchuyenbay', {
            fields: ['MaSBTG'],
            type: 'foreign key',
            references: {
                table: 'sanbay',
                field: 'MaSanBay',
            },
        });

        //ChuyenBay - SanBay
        await queryInterface.removeConstraint('chuyenbay', {
            fields: ['MaSanBayDi'],
            type: 'foreign key',
            references: {
                table: 'sanbay',
                field: 'MaSanBay',
            },
        });

        await queryInterface.removeConstraint('chuyenbay', {
            fields: ['MaSanBayDen'],
            type: 'foreign key',
            references: {
                table: 'sanbay',
                field: 'MaSanBay',
            },
        });

        //DoanhThu Thang - Nam
        await queryInterface.removeConstraint('doanhthuthang', {
            fields: ['Nam'],
            type: 'foreign key',
            references: {
                table: 'doanhthunam',
                field: 'Nam',
            },
        });

        //ChucVu - phanquyen
        await queryInterface.removeConstraint('phanquyen', {
            fields: ['MaChucVu'],
            type: 'foreign key',
            references: {
                table: 'chucvu',
                field: 'MaChucVu',
            },
        });

        //NhanVien - ChucVu
        await queryInterface.removeConstraint('nhanvien', {
            fields: ['MaChucVu'],
            type: 'foreign key',
            references: {
                table: 'chucvu',
                field: 'MaChucVu',
            },
        });

        //Quyen - Phanquyen
        await queryInterface.removeConstraint('phanquyen', {
            fields: ['MaQuyen'],
            type: 'foreign key',
            references: {
                table: 'quyen',
                field: 'MaQuyen',
            },
        });
    },
};
