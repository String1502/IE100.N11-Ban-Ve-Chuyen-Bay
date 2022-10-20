'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HanhKhach extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            HanhKhach.belongsTo(models.LoaiKhachHang, { foreignKey: 'MaLoaiKhach' });
            HanhKhach.hasMany(models.Ve, { foreignKey: 'MaHK' });
        }
    }
    HanhKhach.init(
        {
            MaHK: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            MaLoaiKhach: {
                type: DataTypes.INTEGER,
            },
            HoTen: DataTypes.STRING,
            CCCD: DataTypes.STRING,
            SDT: DataTypes.STRING,
            GioiTinh: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'HanhKhach',
            freezeTableName: true,
        },
    );
    return HanhKhach;
};
