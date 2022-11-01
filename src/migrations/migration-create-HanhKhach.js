'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('hanhkhach', {
            MaHK: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            MaLoaiKhach: {
                type: Sequelize.INTEGER,
            },
            HoTen: {
                type: Sequelize.STRING,
            },
            CCCD: {
                type: Sequelize.STRING(13),
            },
            NgaySinh: {
                type: Sequelize.DATE,
            },
            GioiTinh: {
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
        await queryInterface.dropTable('hanhkhach');
    },
};
