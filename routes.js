import express from 'express';
const router = express.Router();

router.get('/store_img', (request, response) => {
    console.log('Call Route');
    response.json({
        status: 'OK'
    })
})


export default router;