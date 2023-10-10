'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import ajax from '../../../modules/ajax.js';
import Point from './classes/point.js';
import Attractor from './classes/attractor.js';

let fileNo = 0;

const draw = {

    animate() {
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);
        // elements.ctx.fillStyle = 'rgba(0,0,0,.1)'
        // elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height)

        settings.points.forEach(point => {
            point.nearest = false;
            point.inChain = false;
            point.distance = Infinity;
        });
        settings.points.forEach(point => point.draw());
        settings.attractors.forEach(attr => attr.draw());

        // Animation
        if (settings.animate) {
            if (settings.saveFile) {
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
            } else {
                requestAnimationFrame(draw.animate);
            }
        }
    },
    init() {
        settings.points = [...new Array(settings.numPoints)].map(() => new Point())
        settings.attractors = [...new Array(settings.numAttractors)].map(() => new Attractor())
        draw.animate();
        // elements.c.addEventListener('click', draw.animate)
    }
}

export default draw;
export let render = draw.render;