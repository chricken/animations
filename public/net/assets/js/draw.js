'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import ajax from '../../../modules/ajax.js';
import Point from './classes/point.js';
import Attractor from './classes/attractor.js';

let fileNo = 0;

const draw = {

    // render() {

    // console.log(points);

    // let t = 0;

    drawPoint(x, y) {

    },

    animate() {
        /*
         console.clear();
         settings.points.forEach(
             el => console.log({...el})
         )
         */
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);
        // elements.ctx.fillStyle = 'rgba(0,0,0,.05)'
        // elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height)

        // reset all points
        settings.points.forEach(point => {
            point.nearest = [...new Array(settings.numNearest)].map(() => false);
            point.distance = Infinity;
        });
        settings.points.forEach(point => point.draw());
        settings.attractors.forEach(attr => attr.draw());

        // Bogen verändern
        // requestAnimationFrame(draw.animate);


        ajax.saveCanvasToServer(elements.c, `image_${lead0(fileNo, 6)}.png`).then(
            () => {
                fileNo++;
                if (fileNo <= settings.numImages) {
                    let zeit = Date.now() - settings.startTime;
                    zeit = zeit / fileNo * settings.numImages;
                    let ETA = new Date(settings.startTime);
                    ETA.setMilliseconds(ETA.getMilliseconds() + zeit);
                    console.clear();
                    console.log(new Date().toLocaleString());
                    console.log('ETA: ',ETA.toLocaleString());
                    this.animate()
                }
            }
        ).catch(
            console.warn
        )

    },
    init() {
        settings.points = [...new Array(settings.numPoints)].map(() => new Point())
        settings.attractors = [...new Array(settings.numAttractors)].map(() => new Attractor())
        draw.animate();
        elements.c.addEventListener('click', draw.animate)
    }
}

export default draw;
export let render = draw.render;