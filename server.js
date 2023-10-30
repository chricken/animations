'use strict';


import express from 'express';
import routes from './routes.js';
import betterOpn from 'better-opn';

let server = express();

// const projectsToOpn = ['linefields'];
const projectsToOpn = ['landflug'];

server.use(express.static('public'));
server.use((routes));

const init = () => {
    server.listen(80, err => {
        if (err) console.warn(err);
        else {
            console.log('Server läuft');
            projectsToOpn.forEach(project =>
                betterOpn(`http://localhost/${project}`)
            );
        }
    })
}

init();