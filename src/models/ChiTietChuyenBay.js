'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChiTietChuyenBay extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ChiTietChuyenBay.belongsTo(models.ChuyenBay, { foreignKey: 'MaChuyenBay' });
            ChiTietChuyenBay.belongsTo(models.SanBay, { foreignKey: 'MaSBTG' });
        }
    }
    ChiTietChuyenBay.init(
        {
            MaCTCB: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            MaChuyenBay: DataTypes.INTEGER,
            MaSBTG: DataTypes.STRING,
            ThuTu: DataTypes.INTEGER,
            NgayGioDen: DataTypes.DATE,
            ThoiGianDung: DataTypes.INTEGER,
            GhiChu: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ChiTietChuyenBay',
            freezeTableName: true,
        },
    );
    return ChiTietChuyenBay;
};
