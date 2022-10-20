'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('doanhthunam', {
            Nam: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            SoChuyenBay: {
                type: Sequelize.INTEGER,
            },
            DoanhThu: {
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
        await queryInterface.dropTable('doanhthunam');
    },
};
