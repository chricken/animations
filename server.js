'use strict';

import express from 'express';
import routes from './routes.js';
let server = express();

server.use(express.static('public'));
server.use((routes));



const init = () => {
    server.listen(80, err => {
        if (err) console.warn(err);
        else console.log('Server läuft');
    })
}

init();