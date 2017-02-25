import express from 'express';
import bodyParser from 'body-parser';

import bulkApi from './bulk';


const api = express();

api.use(bodyParser.json());
api.use('/bulk', bulkApi);


export default api;
