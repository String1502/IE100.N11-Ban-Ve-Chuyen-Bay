'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChuyenBay extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ChuyenBay.hasMany(models.ChiTietHangVe, { foreignKey: 'MaChuyenBay' });
            ChuyenBay.hasMany(models.ChiTietChuyenBay, { foreignKey: 'MaChuyenBay' });
            ChuyenBay.belongsTo(models.SanBay, { foreignKey: 'MaSanBayDi' });
            ChuyenBay.belongsTo(models.SanBay, { foreignKey: 'MaSanBayDen' });
        }
    }
    ChuyenBay.init(
        {
            MaChuyenBay: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            MaSanBayDi: DataTypes.STRING,
            MaSanBayDen: DataTypes.STRING,
            NgayGio: DataTypes.DATE,
            ThoiGianBay: DataTypes.INTEGER,
            GiaVeCoBan: DataTypes.BIGINT,
            DoanhThu: DataTypes.BIGINT,
            TrangThai: DataTypes.STRING,
            ThoiGianBayToiThieu: DataTypes.INTEGER,
            ThoiGianDungToiThieu: DataTypes.INTEGER,
            SBTG_Max: DataTypes.INTEGER,
            GiaVeCoBan_Min: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ChuyenBay',
            freezeTableName: true,
        },
    );
    return ChuyenBay;
};
