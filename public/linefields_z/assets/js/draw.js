'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '../../../modules/noises.js';
import ajax from '/modules/ajax.js';
import Line from './classes/line.js';

const draw = {
    step() {
        // console.clear();
        // console.log(settings.lines.length);
        // Ein Bild rendern
        settings.counter++;

        if (settings.counter % settings.res == 0) {
            draw.addLine()
        }

        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        settings.lines.forEach(line => line.update());

        // console.log(settings.counter);
        draw.animate();
    },

    addLine() {
        settings.lines.splice(0, 0, new Line(0));
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
        
        settings.perlin = new Perlin(settings.p);

        draw.addLine();

        draw.step();
    }
}

export default draw;
export let render = draw.render;