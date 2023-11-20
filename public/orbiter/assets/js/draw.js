'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers,{ rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';
import Point from './classes/point.js';

const draw = {
    step() {
        // Ein Bild rendern
        settings.counter++;


        // elements.ctx.fillStyle = 'hsla(0,0%,100%,.01)';
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        settings.points.forEach(point => point.update());

        draw.fillDistanceMap();

        // draw.animate();
    },
    fillDistanceMap() {
        for (let y = 0; y < settings.cSize.y; i++) {
            for (let x = 0; x < settings.cSize.x; x++) {

                let nearest = settings.points.reduce((tempNearest, point) => {
                    let dist = helpers.pythagorasPoints({x,y}, point)
                    point.distance = dist;

                    console.log(tempNearest.distance);
                    return  (point.distance < tempNearest.distance) ? point : tempNearest;
                }, {
                    distance:Infinity,
                }

                )
            }
        }
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

        settings.points = [...new Array(settings.numPoints)].map(() => {
            return new Point();
        });

        settings.distanceMap = [...new Array(settings.cSize.y)].map(() => {
            return [...(new Array(settings.cSize.x))].map(() => {
                return {
                    distance: 0,
                    angle: 0
                }
            })
        });
        console.log(settings.distanceMap);

        draw.step();
    }
}

export default draw;
export let render = draw.render;