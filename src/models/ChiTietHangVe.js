'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChiTietHangVe extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ChiTietHangVe.hasMany(models.Ve, { foreignKey: 'MaCTVe' });
            ChiTietHangVe.belongsTo(models.HangGhe, { foreignKey: 'MaHangGhe' });
            ChiTietHangVe.belongsTo(models.ChuyenBay, { foreignKey: 'MaChuyenBay' });
        }
    }
    ChiTietHangVe.init(
        {
            MaCTVe: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            MaChuyenBay: DataTypes.INTEGER,
            MaHangGhe: DataTypes.INTEGER,
            TongVe: DataTypes.INTEGER,
            VeDaBan: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ChiTietHangVe',
            freezeTableName: true,
        },
    );
    return ChiTietHangVe;
};
