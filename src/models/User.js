'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.ChucVu, { foreignKey: 'MaChucVu' });
            User.hasMany(models.HoaDon, { foreignKey: 'MaUser' });
        }
    }
    User.init(
        {
            MaUser: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING,
            },
            Email: DataTypes.STRING,
            MatKhau: DataTypes.STRING,
            HoTen: DataTypes.STRING,
            CCCD: DataTypes.STRING,
            GioiTinh: DataTypes.INTEGER,
            NgaySinh: DataTypes.DATEONLY,
            MaChucVu: DataTypes.STRING(5),
            HinhAnh: DataTypes.STRING,
            TrangThai: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
            freezeTableName: true,
        },
    );
    return User;
};
