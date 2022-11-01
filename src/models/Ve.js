'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ve extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Ve.belongsTo(models.HanhKhach, { foreignKey: 'MaHK' });
            Ve.belongsTo(models.MocHanhLy, { foreignKey: 'MaMocHanhLy' });
            Ve.belongsTo(models.HoaDon, { foreignKey: 'MaHoaDon' });
            Ve.belongsTo(models.ChiTietHangVe, { foreignKey: 'MaCTVe' });
        }
    }
    Ve.init(
        {
            MaVe: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            MaMocHanhLy: DataTypes.INTEGER,
            MaCTVe: DataTypes.INTEGER,
            MaHK: DataTypes.INTEGER,
            GiaVe: DataTypes.BIGINT,
            MaHoaDon: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Ve',
            freezeTableName: true,
        },
    );
    return Ve;
};
