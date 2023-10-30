'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import ajax from '/modules/ajax.js';
import Line from './classes/line.js';

const draw = {
    step() {
        console.clear();
        console.log(settings.lines);
        // Ein Bild rendern
        settings.counter++;
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        settings.lines.forEach(line => line.update());

        // console.log(settings.counter);
        draw.animate();
    },
    animate() {
        // Speichern und rendervorgang erneuern
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
        // Wird initial einmal aufgerufen
        settings.counter = 0;

        // Linien erzeugen
        settings.lines = [...new Array(settings.numLines)].map(
            (val, i) => {
                // Relativer Abstand von oben
                return new Line(1 - (1 / settings.numLines * i))
            }
        )

        draw.animate();
    }
}

export default draw;
export let render = draw.render;