const express = require('express');
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/index';
import connectDB from './config/connectDB';
const methodOverride = require('method-override');
require('dotenv').config();

const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);

initWebRoutes(app);

//static file
app.use(express.static('./src/pulic'));

app.use(methodOverride('_method'));

connectDB();

//Bthuong thi nó chạy ở port 8080, lỗi thì qua 8081
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log('Server chay o port: ' + port);
});
