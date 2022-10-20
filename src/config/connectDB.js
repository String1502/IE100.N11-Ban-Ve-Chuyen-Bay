const { Sequelize } = require('sequelize');
//
//npx sequelize-cli db:migrate
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('quanlymaybay', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    init: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true,
    },
    logging: false,
    query: {
        raw: true,
        nest: true,
        freezeTableName: true,
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;
