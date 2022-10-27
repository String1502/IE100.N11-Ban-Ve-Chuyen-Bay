'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DoanhThuThang extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DoanhThuThang.belongsTo(models.DoanhThuNam, { foreignKey: 'Nam' });
        }
    }
    DoanhThuThang.init(
        {
            Nam: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            Thang: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            SoChuyenBay: DataTypes.INTEGER,
            DoanhThu: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: 'DoanhThuThang',
            freezeTableName: true,
        },
    );
    return DoanhThuThang;
};
