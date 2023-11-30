'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';

const draw = {

    step() {
        // Ein Bild rendern
        settings.counter++;

        let c = elements.c;
        let ctx = c.getContext('2d');
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.clearRect(0, 0, settings.cSize.x, settings.cSize.y);

        for (let y = 0; y < settings.cSize.y; y += settings.squareSize) {
            for (let x = 0; x < settings.cSize.x; x += settings.squareSize) {
                ctx.save()
                let zoom = 5;
                let size = settings.squareSize;
                ctx.translate(x, y);
                
                size *= Math.sin((settings.posX + x) / zoom / 180 * Math.PI);
                size *= Math.cos((settings.posY + y) / zoom / 180 * Math.PI);
                ctx.rotate(size/50)

                ctx.strokeRect(
                    0 - size / 2,
                    0 - size / 2,
                    size,
                    size
                )
                ctx.restore()
            }
        }

        if (settings.animate) draw.animate();
    },

    animate() {
        // Speichern und rendervorgang erneuern
        settings.fileNo++;

        settings.posX += settings.speedX;
        settings.posY += settings.speedY;

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

        // draw.step();
        draw.step();
    }
}

export default draw;
export let render = draw.render;