'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Quyen extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Quyen.hasMany(models.PhanQuyen, { foreignKey: 'MaQuyen' });
        }
    }
    Quyen.init(
        {
            MaQuyen: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            TenQuyen: DataTypes.STRING,
            TenManHinhDuocLoad: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Quyen',
            freezeTableName: true,
        },
    );
    return Quyen;
};
