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
                type: Sequelize.INTEGER,
            },
            MaSanBayDen: {
                type: Sequelize.INTEGER,
            },
            NgayGio: {
                type: Sequelize.DATE,
            },
            ThoiGianBay: {
                type: Sequelize.DATE,
            },
            GiaVeCoBan: {
                type: Sequelize.INTEGER,
            },
            GhiChu: {
                type: Sequelize.STRING,
            },
            DoanhThu: {
                type: Sequelize.INTEGER,
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
