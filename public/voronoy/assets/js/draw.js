'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { rnd, lead0 } from '../../../modules/helpers.js';
import ajax from '../../../modules/ajax.js';
import Point from './classes/point.js';
import Attractor from './classes/attractor.js';

let fileNo = 0;
let distanceEnhancer = 1.2;

const draw = {

    voronoy() {
        let imgData = elements.ctx.getImageData(0, 0, elements.c.width, elements.c.height);
        let nearestNearest = Infinity;
        let farestNearest = 0;
        for (let i = 0; i < imgData.data.length; i += 4) {

            let x = (i / 4) % imgData.width;
            let y = ~~((i / 4) / imgData.width);

            let nearestPoint = { distance: Infinity, point: false };

            for (let i = 0; i < settings.points.length; i++) {
                let point = settings.points[i];
                let distance = helpers.pythagoras(
                    x - point.x,
                    y - point.y
                )
                nearestPoint = (distance < nearestPoint.distance) ? { distance, point } : nearestPoint;
                /*
                nearestNearest = (nearestPoint.distance < nearestNearest) ? nearestPoint.distance : nearestNearest;
                farestNearest = (nearestPoint.distance > farestNearest) ? nearestPoint.distance : farestNearest;
                */
            }
            // let amp = (nearestPoint.distance ** (1 / distanceEnhancer));
            let amp = 255 / (nearestPoint.distance * distanceEnhancer);
            let maxValue = 150;
            imgData.data[i] = maxValue - ~~(nearestPoint.point.r / amp);
            imgData.data[i + 1] = maxValue - ~~(nearestPoint.point.g / amp);
            imgData.data[i + 2] = maxValue - ~~(nearestPoint.point.b / amp);
            imgData.data[i + 3] = 255;
        }
        elements.ctx.putImageData(imgData, 0, 0);
        /*
        console.log(nearestNearest);
        console.log(farestNearest);
        */
    },

    animate() {
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);
        // elements.ctx.fillStyle = 'rgba(0,0,0,.05)'
        // elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height)

        // settings.points.forEach(point => point.draw());
        // settings.attractors.forEach(attr => attr.draw());

        settings.points.forEach(point => point.move());
        settings.attractors.forEach(attr => attr.move());
        // console.log('Calculation stratet!');
        // console.time()

        draw.voronoy();

        // console.timeEnd()
        // Bogen verändern
        // requestAnimationFrame(draw.animate);

        
        ajax.saveCanvasToServer(elements.c, `image_${lead0(fileNo, 6)}.png`).then(
            () => {
                fileNo++;
                if (fileNo <= 10800) {
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
    }
}

export default draw;
export let render = draw.render;