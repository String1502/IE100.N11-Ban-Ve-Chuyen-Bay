'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ThamSo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ThamSo.init(
        {
            TenThamSo: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING,
            },
            GiaTri: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ThamSo',
            freezeTableName: true,
        },
    );
    return ThamSo;
};
