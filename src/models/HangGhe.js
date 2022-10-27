'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HangGhe extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            HangGhe.hasMany(models.ChiTietHangVe, { foreignKey: 'MaHangGhe' });
        }
    }
    HangGhe.init(
        {
            MaHangGhe: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING,
            },
            TenHangGhe: DataTypes.STRING,
            HeSo: DataTypes.DECIMAL(4, 2),
            TrangThai: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'HangGhe',
            freezeTableName: true,
        },
    );
    return HangGhe;
};
