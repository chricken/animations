'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import ajax from '/modules/ajax.js';
import Line from './classes/line.js';

const draw = {
    yStart: 0,
    yEnd: 0,

    step() {
        settings.counter++;
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        settings.lines.forEach(line => line.update());
        draw.animate()
    },
    addLine() {
        settings.lines.push(new Line());
    },
    animate() {
        if (settings.saveFile) {
            if (settings.fileNo < settings.maxFiles) {
                ajax.saveCanvasToServer(elements.c, `image_${lead0(settings.fileNo, 6)}.png`).then(
                    () => {
                        settings.fileNo++;
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
        settings.counter = 0;
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        draw.addLine();

        draw.animate();
    }
}

export default draw;
export let render = draw.render;