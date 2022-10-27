'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sanbay', {
            MaSanBay: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            TenSanBay: {
                type: Sequelize.STRING,
            },
            TrangThai: {
                type: Sequelize.STRING,
            },
            MaTinhThanh: {
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
        await queryInterface.dropTable('sanbay');
    },
};
