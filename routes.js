'use strict';

import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
const router = express.Router();

let uploadDir = 'public/uploads/';

router.get('/store_img', (request, response) => {
    console.log('Call Route');
    response.json({
        status: 'OK'
    })
})

router.post('/save_image', (req, res) => {
    let form = formidable({
        uploadDir,
        keepExtensions: true,
    })

    form.parse(req, (err, fields, files) => {
        if (err) res.json({ status: 'err', error: "Parsing Error" });
        else {
            files.file.forEach(file => {

                fs.rename(
                    uploadDir + file.newFilename,
                    uploadDir + file.originalFilename,
                    err => {
                        if (err) console.log(err)
                    }
                )
            })
            res.json({ status: 'ok' });

        }
    })
})

export default router;