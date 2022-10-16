'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NhanVien extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            NhanVien.belongsTo(models.ChucVu, { foreignKey: 'MaChucVu' });
        }
    }
    NhanVien.init(
        {
            MaNV: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            Email: DataTypes.STRING,
            MatKhau: DataTypes.STRING,
            CCCD: DataTypes.STRING,
            GioiTinh: DataTypes.BOOLEAN,
            NgaySinh: DataTypes.DATE,
            MaChucVu: DataTypes.INTEGER,
            HinhAnh: DataTypes.STRING,
            TrangThai: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'NhanVien',
            freezeTableName: true,
        },
    );
    return NhanVien;
};
