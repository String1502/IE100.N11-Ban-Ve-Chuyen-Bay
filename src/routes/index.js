const siteRouter = require('./site');

const route = (app) => {
    app.use('/', siteRouter);
};

module.exports = route;
