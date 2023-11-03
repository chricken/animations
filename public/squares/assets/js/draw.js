'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';
import Square from './classes/square.js';

const draw = {
    step() {
        // Ein Bild rendern
        settings.counter++;

        // Noise neu füllen
        draw.drawNoise();

        // Noise verschieben
        settings.posZ += settings.deltaZ;

        elements.ctx.fillStyle = 'hsla(0,0%,100%,.01)';
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);
        // elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height);

        settings.points.forEach(point => point.update());

        draw.animate();
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
    drawNoise() {

        let c = elements.c;
        let ctx = elements.ctx;
        let img = ctx.getImageData(0, 0, c.width, c.height);

        // Globales Array mit der Flow-Map
        settings.noise = new Array(c.height);
        settings.noise = [...settings.noise].map(() => new Array(c.width));
        
        // Flowmap füllen
        for (let i = 0; i < img.data.length; i += 4) {
            let index = i / 4;
            let x = index % c.width;
            let y = ~~(index / c.width);
            let z = settings.posZ;
            let value = (settings.perlin.noise(
                x / settings.noiseZoom,
                y / settings.noiseZoom,
                z / settings.noiseZoom
                ) + 1) / 2
                
            settings.noise[y][x] = value
            /*
            // Flowmap im Canvas darstellen
            img.data[i] = ~~(value*255);
            img.data[i + 1] = ~~(value*255);
            img.data[i + 2] = ~~(value*255);
            img.data[i + 3] = 255;
            */
        }
        
        // console.log(settings.noise);
        
        // ctx.putImageData(img, 0, 0);
    },
    init() {
        // Wird initial einmal aufgerufen
        settings.counter = 0;

        settings.perlin = new Perlin(settings.p);

        settings.squares = [...new Array(settings.numSquares)].map(() => new Square());

        draw.step();
    }
}

export default draw;
export let render = draw.render;