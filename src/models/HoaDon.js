'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HoaDon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            HoaDon.hasMany(models.Ve, { foreignKey: 'MaHoaDon' });
            HoaDon.belongsTo(models.HtThanhToan, { foreignKey: 'MaHTTT' });
        }
    }
    HoaDon.init(
        {
            MaHoaDon: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            HoTen: DataTypes.STRING,
            Email: DataTypes.STRING,
            SDT: DataTypes.STRING,
            NgayGioDat: DataTypes.DATE,
            NgayGioThanhToan: DataTypes.DATE,
            MaHTTT: DataTypes.INTEGER,
            TongTien: DataTypes.INTEGER,
            TrangThai: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'HoaDon',
            freezeTableName: true,
        },
    );
    return HoaDon;
};
