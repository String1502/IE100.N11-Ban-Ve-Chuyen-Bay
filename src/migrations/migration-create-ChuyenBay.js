'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('chuyenbay', {
            MaChuyenBay: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            MaSanBayDi: {
                type: Sequelize.STRING,
            },
            MaSanBayDen: {
                type: Sequelize.STRING,
            },
            NgayGio: {
                type: Sequelize.DATE,
            },
            ThoiGianBay: {
                type: Sequelize.INTEGER,
            },
            GiaVeCoBan: {
                type: Sequelize.BIGINT,
            },
            DoanhThu: {
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
        await queryInterface.dropTable('chuyenbay');
    },
};
