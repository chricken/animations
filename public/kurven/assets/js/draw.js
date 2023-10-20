'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';

const draw = {
    yStart: 0,
    yEnd: 0,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    renderCurve() {
        let c = elements.c;
        let ctx = c.getContext('2d');

        ctx.lineWidth = settings.lineWidth;
        ctx.strokeStyle = `hsl(${(~~settings.hue) % 360},${settings.sat}%,${settings.light}%)`
        /*
        let p1 = [rnd(c.width / 2,0), rnd(0, c.height / 1.5)];
        let p2 = [rnd(c.width / 2, c.width), rnd(c.height / .3, c.height)];
        */

        let p1 = [draw.x1, draw.y1];
        let p2 = [draw.x2, draw.y2];

        ctx.beginPath();


        ctx.fillStyle = '#f00'
        ctx.fillRect(p1.x, p1.y, 1, 1)
        ctx.fillStyle = '#0f0'
        ctx.fillRect(p2.x, p2.y, 1, 1)


        ctx.moveTo(0, draw.yStart);
        ctx.bezierCurveTo(...p1, ...p2, c.width, draw.yEnd);

        ctx.stroke()
    },
    step() {
        // console.clear()
        // console.log(settings);
        for (let i = 0; i < settings.numIterations; i++) {
            settings.counter++
            let changed = false;
            draw.renderCurve();

            let vorher = ~~draw.x1;
            draw.x1 += rnd(-settings.deltaPos * 10, settings.deltaPos * 10) / 10;
            // if (~~draw.x1 != vorher) console.log('x1', draw.x1);

            vorher = ~~draw.x2;
            draw.x2 += rnd(-settings.deltaPos * 10, settings.deltaPos * 10) / 10;
            // if (~~draw.x2 != vorher) console.log('x2', draw.x2);

            vorher = ~~draw.y1;
            draw.y1 += rnd(-settings.deltaPos * 10, settings.deltaPos * 10) / 10;
            // if (~~draw.y1 != vorher) console.log('y1', draw.y1);

            vorher = ~~draw.y2;
            draw.y2 += rnd(-settings.deltaPos * 10, settings.deltaPos * 10) / 10;
            // if (~~draw.y2 != vorher) console.log('y2', draw.y2);

            vorher = ~~draw.yStart;
            draw.yStart += rnd(-settings.deltaPosStartEnd * 10, settings.deltaPosStartEnd * 10) / 10;
            // if (~~draw.yStart != vorher) console.log('yStart', draw.yStart);

            vorher = ~~draw.yEnd;
            draw.yEnd += rnd(-settings.deltaPosStartEnd * 10, settings.deltaPosStartEnd * 10) / 10;
            // if (~~draw.yEnd != vorher) console.log('yEnd', draw.yEnd);

            // Farben 
            settings.hue += settings.deltaHue;
        }
        // console.log(settings.counter);
        requestAnimationFrame( draw.step);
    },
    init() {
        settings.counter = 0;
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height)
        draw.yStart = rnd(0, elements.c.height);
        draw.yEnd = rnd(0, elements.c.height);

        draw.x1 = rnd(0, elements.c.width / 3 * 2);
        draw.x2 = rnd((elements.c.width - draw.x1) + (elements.c.width / 10), (elements.c.width / 10));

        draw.y1 = rnd(0, elements.c.height);
        draw.y2 = rnd(0, elements.c.height);

        requestAnimationFrame( draw.step);
    }
}

export default draw;
export let render = draw.render;