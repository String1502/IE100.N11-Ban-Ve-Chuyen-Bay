'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PhanQuyen extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            PhanQuyen.belongsTo(models.ChucVu, { foreignKey: 'MaChucVu' });
            PhanQuyen.belongsTo(models.Quyen, { foreignKey: 'MaQuyen' });
        }
    }
    PhanQuyen.init(
        {
            MaChucVu: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING,
            },
            MaQuyen: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'PhanQuyen',
            freezeTableName: true,
        },
    );
    return PhanQuyen;
};
