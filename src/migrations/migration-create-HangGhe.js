'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('hangghe', {
            MaHangGhe: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            TenHangGhe: {
                type: Sequelize.STRING,
            },
            HeSo: {
                type: Sequelize.DECIMAL(4, 2),
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
        await queryInterface.dropTable('hangghe');
    },
};
