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
                type: Sequelize.STRING,
            },
            SDT: {
                type: Sequelize.STRING,
            },
            GioiTinh: {
                type: Sequelize.BOOLEAN,
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
