'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('thamso', {
            TenThamSo: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            GiaTri: {
                type: Sequelize.INTEGER,
            },
            TenHienThi: {
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
        await queryInterface.dropTable('thamso');
    },
};
