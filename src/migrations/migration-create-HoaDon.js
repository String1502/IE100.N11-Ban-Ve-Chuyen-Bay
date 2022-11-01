'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('hoadon', {
            MaHoaDon: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            MaUser: {
                type: Sequelize.STRING,
            },
            HoTen: {
                type: Sequelize.STRING,
            },
            Email: {
                type: Sequelize.STRING,
            },
            SDT: {
                type: Sequelize.STRING(11),
            },
            NgayGioDat: {
                type: Sequelize.DATE,
            },
            NgayGioThanhToan: {
                type: Sequelize.DATE,
            },
            MaHTTT: {
                type: Sequelize.STRING(10),
            },
            TongTien: {
                type: Sequelize.BIGINT,
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
        await queryInterface.dropTable('hoadon');
    },
};
