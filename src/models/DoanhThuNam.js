'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DoanhThuNam extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DoanhThuNam.hasMany(models.DoanhThuThang, { foreignKey: 'Nam' });
        }
    }
    DoanhThuNam.init(
        {
            Nam: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            SoChuyenBay: DataTypes.INTEGER,
            DoanhThu: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'DoanhThuNam',
            freezeTableName: true,
        },
    );
    return DoanhThuNam;
};
