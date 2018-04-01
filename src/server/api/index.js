import express from 'express';
import bodyParser from 'body-parser';

import bulkApi from './bulk';
import duplicatesApi from './duplicates';


const api = express();

api.use(bodyParser.json());
api.use('/bulk', bulkApi);
api.use('/duplicates', duplicatesApi);


export default api;
