'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { RtA, rnd, lead0 } from '../../../modules/helpers.js';
import dom from '../../../modules/dom.js';
import ajax from '../../../modules/ajax.js';

// Klassen
import MandelbrotFractal from './mandelbrot.js';

let fileNo = 0;

const draw = {

    render() {
        let c = elements.c;
        // console.log(settings.z);

        let fractal = new MandelbrotFractal();
        // fractal.draw();
        fractal.draw(
            0 - settings.posX,
            0 - settings.posY,
            (0 - settings.posX) + (settings.zoom),
            (0 - settings.posY) + (settings.zoom * settings.proportions),
        )

        // Bildinhalt an server senden und dort speichern
        /*
        ajax.saveCanvasToServer(c, `image_${lead0(fileNo, 6)}.png`).then(
            () => fileNo++
        ).then(
            // () => requestAnimationFrame(render)
        ).catch(
            console.warn
        )
        */

    }
}

export default draw;
export let render = draw.render;