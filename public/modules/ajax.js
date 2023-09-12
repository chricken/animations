'use strict';

import helpers from './helpers.js';

const ajax = {
    saveCanvasToServer(c, fileName) {
        return new Promise((resolve, reject) => {

            // Get the canvas data as a URL
            const cDataURL = c.toDataURL('image/png');

            // Remove the 'data:image/png;base64,' part from the data URL
            let base64ImageContent = cDataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            // Create a blob from the canvas data URL
            const canvasBlob = helpers.base64ToBlob(base64ImageContent, 'image/png')

            let formData = new FormData();
            formData.append('file', canvasBlob, fileName);

            fetch('/save_image', {
                method: 'POST',
                body: formData
            }).then(
                res => res.json()
            ).then(
                resolve
            ).catch(
                reject
            );

            // resolve();
        })
    },
}

export default ajax;
