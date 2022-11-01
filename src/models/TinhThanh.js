'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TinhThanh extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            TinhThanh.hasMany(models.SanBay, { foreignKey: 'MaTinhThanh' });
        }
    }
    TinhThanh.init(
        {
            MaTinhThanh: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            TenTinhThanh: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'TinhThanh',
            freezeTableName: true,
        },
    );
    return TinhThanh;
};
