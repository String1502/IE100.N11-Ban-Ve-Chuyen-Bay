'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('htthanhtoan', {
            MaHTTT: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING(10),
            },
            Ten: {
                type: Sequelize.STRING,
            },
            ThoiGianCho: {
                type: Sequelize.INTEGER,
            },
            GhiChu: {
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
        await queryInterface.dropTable('htthanhtoan');
    },
};
