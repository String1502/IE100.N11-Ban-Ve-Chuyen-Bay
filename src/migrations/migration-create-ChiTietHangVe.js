'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('chitiethangve', {
            MaCTVe: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            MaChuyenBay: {
                type: Sequelize.INTEGER,
            },
            MaHangGhe: {
                type: Sequelize.STRING,
            },
            TongVe: {
                type: Sequelize.INTEGER,
            },
            VeDaBan: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('chitiethangve');
    },
};
