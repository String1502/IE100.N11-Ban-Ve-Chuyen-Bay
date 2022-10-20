'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ve', {
            MaVe: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            MaMocHanhLy: {
                type: Sequelize.INTEGER,
            },
            MaCTVe: {
                type: Sequelize.INTEGER,
            },
            MaHK: {
                type: Sequelize.INTEGER,
            },
            GiaVe: {
                type: Sequelize.INTEGER,
            },
            MaHoaDon: {
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
        await queryInterface.dropTable('ve');
    },
};
