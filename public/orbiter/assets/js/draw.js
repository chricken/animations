'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';
import Point from './classes/point.js';
import Orbiter from './classes/orbiter.js';

const draw = {
    step() {
        // Ein Bild rendern
        settings.counter++;


        
        elements.ctx.fillStyle = 'hsla(0,0%,0%,.02)';
        elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height);
        // elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        // settings.points.forEach(point => point.update());
        settings.points.forEach(point => point.update());
        settings.orbiters.forEach(orbiter => orbiter.update());

        // draw.fillDistanceMap();

        if (settings.animate) draw.animate();
    },
    animate() {
        // Speichern und rendervorgang erneuern
        settings.fileNo++;
        if (settings.saveFile) {
            if (settings.fileNo < settings.maxFiles) {
                ajax.saveCanvasToServer(elements.c, `image_${lead0(settings.fileNo, 6)}.png`).then(
                    () => {
                        requestAnimationFrame(draw.step)
                    }
                ).catch(
                    console.warn
                )
            }
        } else {
            requestAnimationFrame(draw.step)
        }
    },
    init() {
        // Wird initial einmal aufgerufen
        settings.counter = 0;
        settings.orbiters = [...new Array(settings.numOrbiters)].map(() => {
            return new Orbiter();
        })

        settings.points = [...new Array(settings.numPoints)].map(() => {
            return new Point();
        })


        draw.step();
    }
}

export default draw;
export let render = draw.render;