'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { RtA, rnd } from '../../../modules/helpers.js';

const numRect = 200, minSize = .01, maxSize = .05;

const draw = {
    render(c = elements.c) {
        let ctx = c.getContext('2d');

        // clear Canvas
        ctx.clearRect(0, 0, ...RtA(1, 1));

        // Einfach ein paar Quadrate zeichnen
        for (let i = 0; i < numRect; i++) {
            // Füllfarbe bestimmen
            ctx.fillStyle = helpers.createColor({ minHue: 0, maxHue: 10, minAlpha:.2, maxAlpha:.3 });

            // Größe bestimmen
            let size = rnd(minSize, maxSize, 4);

            // Ein Quadrat zeichnen
            ctx.fillRect(
                ...RtA(
                    rnd(0, 1, 4)-size/2,
                    rnd(0, 1, 4)-size/2,
                ),
                RtA(size, 0)[0],
                RtA(size, 0)[0],
            )

        }
        helpers.writeCToFile()
    }
}

export default draw;
export let render = draw.render;