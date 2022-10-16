'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SanBay extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SanBay.hasMany(models.ChiTietChuyenBay, { foreignKey: 'MaSBTG' });
            SanBay.hasMany(models.ChuyenBay, { foreignKey: 'MaSanBayDi' });
            SanBay.hasMany(models.ChuyenBay, { foreignKey: 'MaSanBayDen' });
        }
    }
    SanBay.init(
        {
            MaSanBay: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            TenSanBay: DataTypes.STRING,
            TrangThai: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'SanBay',
            freezeTableName: true,
        },
    );
    return SanBay;
};
