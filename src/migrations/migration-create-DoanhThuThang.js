'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('doanhthuthang', {
            Nam: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            Thang: {
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
        await queryInterface.dropTable('doanhthuthang');
    },
};
