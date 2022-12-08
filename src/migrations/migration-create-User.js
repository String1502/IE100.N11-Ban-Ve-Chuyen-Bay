'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user', {
            MaUser: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            Email: {
                type: Sequelize.STRING,
            },
            MatKhau: {
                type: Sequelize.STRING,
            },
            HoTen: {
                type: Sequelize.STRING,
            },
            CCCD: {
                type: Sequelize.STRING,
            },
            GioiTinh: {
                type: Sequelize.INTEGER,
            },
            NgaySinh: {
                type: Sequelize.DATEONLY,
            },
            MaChucVu: {
                type: Sequelize.STRING(5),
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
        await queryInterface.dropTable('user');
    },
};
