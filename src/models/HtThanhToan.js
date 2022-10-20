'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HtThanhToan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            HtThanhToan.hasMany(models.HoaDon, { foreignKey: 'MaHTTT' });
        }
    }
    HtThanhToan.init(
        {
            MaHTTT: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            Ten: DataTypes.STRING,
            ThoiGianCho: DataTypes.INTEGER,
            GhiChu: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'HtThanhToan',
            freezeTableName: true,
        },
    );
    return HtThanhToan;
};
