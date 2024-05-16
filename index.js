import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {connectToMongoDB} from './config/mongooseConfig.js'
import { portFolioRouter } from './src/features/portfolio/portfolio.routes.js';
import { tradeRouter } from './src/features/trade/trade.routes.js';
import bodyParser from 'body-parser';

const app = express();
const PORT_NUMBER = process.env.PORT_NUMBER;

app.use(bodyParser.json());

app.use('/api/portfolio',portFolioRouter);
app.use('/api/portfolio/trade',tradeRouter);

app.listen(PORT_NUMBER,() => {
    console.log(`Server is Listening on port ${PORT_NUMBER}`);
    connectToMongoDB();
})