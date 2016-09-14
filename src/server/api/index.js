import express from 'express';
import bodyParser from 'body-parser';

import importApi from './import';


const api = express();

api.use(bodyParser.json());
api.use('/import', importApi);


export default api;
