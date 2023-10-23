'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0, clamp } from '../../../modules/helpers.js';
import ajax from '../../../../modules/ajax.js';

const draw = {
    yStart: 0,
    yEnd: 0,

    x1: 0,
    y1: 0,

    x2: 0,
    y2: 0,

    x3: 0,
    y3: 0,

    x4: 0,
    y4: 0,

    renderCurves() {
        let c = elements.c;
        let ctx = c.getContext('2d');

        ctx.clearRect(0, 0, c.width, c.height);

        ctx.lineWidth = settings.lineWidth;
        console.clear();
        console.log(settings.curves);

        for (let i = 0; i < settings.curves.length; i++) {

            const curve = settings.curves[i];

            ctx.strokeStyle = curve.color;

            ctx.beginPath();

            /*
            ctx.fillStyle = '#f00'
            ctx.fillRect(p1.x, p1.y, 1, 1)
            ctx.fillStyle = '#0f0'
            ctx.fillRect(p2.x, p2.y, 1, 1)
            */

            ctx.moveTo(...curve.startPoint);
            ctx.bezierCurveTo(
                ...curve.Points1,
                ...curve.middlePoint
            );
            ctx.bezierCurveTo(
                ...curve.Points2,
                ...curve.endPoint
            );

            ctx.stroke()
        }
    },
    addCurve() {

        let p1 = [draw.x1, draw.y1];
        let p2 = [draw.x2, draw.y2];

        let hue = settings.hue + 360;
        hue = hue % 360;

        settings.curves.push({
            startPoint: [0, draw.yStart],
            Points1: [draw.x1, draw.y1, draw.x2, draw.y2],
            middlePoint: [draw.xMiddle, draw.yMiddle],
            Points2: [draw.x3, draw.y3, draw.x4, draw.y4],
            endPoint: [elements.c.width, draw.yEnd],
            color: `hsla(${(~~settings.hue) % 360},${settings.sat}%,${settings.light}%,.1)`
        });

    },
    step() {
        // console.clear()
        // console.log(settings);
        for (let i = 0; i < settings.numIterations; i++) {
            settings.counter++
            let changed = false;
            // draw.renderCurve();
            draw.addCurve()

            draw.x1 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.x1 = clamp(draw.x1, 0, elements.c.width);
            draw.y1 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.y1 = clamp(draw.y1, 0, elements.c.height);

            draw.x2 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.x2 = clamp(draw.x2, 0, elements.c.width);
            draw.y2 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.y2 = clamp(draw.y2, 0, elements.c.height);

            draw.x3 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.x3 = clamp(draw.x3, 0, elements.c.width);
            draw.y3 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.y3 = clamp(draw.y3, 0, elements.c.height);

            draw.x4 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.x4 = clamp(draw.x4, 0, elements.c.width);
            draw.y4 += rnd(-settings.deltaPos * 1000, settings.deltaPos * 1000) / 1000;
            draw.y4 = clamp(draw.y4, 0, elements.c.height);

            draw.xMiddle = (draw.x2 + draw.x3) / 2
            draw.yMiddle = (draw.y2 + draw.y3) / 2

            draw.yStart += rnd(-settings.deltaPosStartEnd * 1000, settings.deltaPosStartEnd * 1000) / 1000;

            draw.yEnd += rnd(-settings.deltaPosStartEnd * 1000, settings.deltaPosStartEnd * 1000) / 1000;

            // Farben 
            settings.hue += rnd(-settings.deltaHue * 1000, settings.deltaHue * 1000) / 1000;
        }
        if (settings.curves.length > settings.maxCurves) {
            let numToKill = settings.curves.length - settings.maxCurves;
            settings.curves.splice(0, numToKill);
        }
        draw.renderCurves();

        // console.log(settings.counter);
        draw.animate();
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
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height)

        draw.yStart = rnd(elements.c.height / 3, elements.c.height / 3 * 2);
        draw.yEnd = rnd(elements.c.height / 3, elements.c.height / 3 * 2);

        draw.x1 = elements.c.width / 6;
        draw.y1 = rnd(0, elements.c.height);

        draw.x2 = elements.c.width / 6 * 2;
        draw.y2 = rnd(0, elements.c.height);

        draw.x3 = elements.c.width / 6 * 4;
        draw.y3 = rnd(0, elements.c.height);

        draw.x4 = elements.c.width / 6 * 5;
        draw.y4 = rnd(0, elements.c.height);

        draw.xMiddle = (draw.x2 + draw.x3) / 2
        draw.yMiddle = (draw.y2 + draw.y3) / 2

        draw.animate();
    }
}

export default draw;
export let render = draw.render;