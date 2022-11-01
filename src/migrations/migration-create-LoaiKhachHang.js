'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('loaikhachhang', {
            MaLoaiKhach: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            TenLoai: {
                type: Sequelize.STRING,
            },
            SoTuoiToiThieu: {
                type: Sequelize.INTEGER,
            },
            SoTuoiToiDa: {
                type: Sequelize.INTEGER,
            },
            HeSo: {
                type: Sequelize.DECIMAL(3, 2),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('loaikhachhang');
    },
};
