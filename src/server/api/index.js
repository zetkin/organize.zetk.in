import express from 'express';
import bodyParser from 'body-parser';

import importApi from './import';
import bulkApi from './bulk';


const api = express();

api.use(bodyParser.json());
api.use('/import', importApi);
api.use('/bulk', bulkApi);


export default api;
