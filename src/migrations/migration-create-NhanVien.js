'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('nhanvien', {
            MaNV: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            Email: {
                type: Sequelize.STRING,
            },
            MatKhau: {
                type: Sequelize.STRING,
            },
            CCCD: {
                type: Sequelize.STRING,
            },
            GioiTinh: {
                type: Sequelize.BOOLEAN,
            },
            NgaySinh: {
                type: Sequelize.DATE,
            },
            MaChucVu: {
                type: Sequelize.INTEGER,
            },
            HinhAnh: {
                type: Sequelize.STRING,
            },
            TrangThai: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('nhanvien');
    },
};
