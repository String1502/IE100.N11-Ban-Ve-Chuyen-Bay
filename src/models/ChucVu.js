'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChucVu extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ChucVu.hasMany(models.User, { foreignKey: 'MaChucVu' });
        }
    }
    ChucVu.init(
        {
            MaChucVu: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING(5),
            },
            TenChucVu: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ChucVu',
            freezeTableName: true,
        },
    );
    return ChucVu;
};
