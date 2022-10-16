'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MocHanhLy extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MocHanhLy.hasMany(models.Ve, { foreignKey: 'MaMocHanhLy' });
        }
    }
    MocHanhLy.init(
        {
            MaMocHanhLy: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            SoKgToiDa: DataTypes.INTEGER,
            GiaTien: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'MocHanhLy',
            freezeTableName: true,
        },
    );
    return MocHanhLy;
};
