'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LoaiKhachHang extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            LoaiKhachHang.hasMany(models.HanhKhach, { foreignKey: 'MaLoaiKhach' });
        }
    }
    LoaiKhachHang.init(
        {
            MaLoaiKhach: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            TenLoai: DataTypes.STRING,
            SoTuoiToiThieu: DataTypes.INTEGER,
            SoTuoiToiDa: DataTypes.INTEGER,
            HeSo: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'LoaiKhachHang',
            freezeTableName: true,
        },
    );
    return LoaiKhachHang;
};
