'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import ajax from '/modules/ajax.js';
import Point from './classes/point.js';
import Attractor from './classes/attractor.js';

const draw = {
    yStart: 0,
    yEnd: 0,


    renderCurves() {
        let c = elements.c;
        let ctx = c.getContext('2d');


        ctx.lineWidth = settings.lineWidth;
        // console.clear();
        // console.log(settings.curves.length);


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

            for (let b = 0; b < curve.beziers.length; b++) {
                ctx.bezierCurveTo(
                    ...curve.beziers[b].p1,
                    ...curve.beziers[b].p2,
                    ...curve.beziers[b].endPoint
                );
            }

            ctx.stroke()

        }
    },
    addCurve() {
        // Eine curve besteht aus mehreren Bezier-Kurven mit je zwei Stützpunkten und einem Endpunkt
        let curve = {
            beziers: []
        };
        settings.curves.push(curve);

        let hue = settings.hue + 360;
        hue = hue % 360;
        curve.color = `hsla(${(~~settings.hue) % 360},${settings.sat}%,${settings.light}%,${settings.opacity})`;

        // Alle zwei Stützpunkte iterieren
        for (let i = 0; i < settings.numPoints; i += 2) {
            // Zur Kurve zwei Stützpunkte für eine Bezier hinzufügen
            curve.beziers.push({
                p1: [settings.points[i].x, settings.points[i].y],
                p2: [settings.points[i + 1].x, settings.points[i + 1].y],
            })
        }

        // Start- und Endpunkte als Zwischenwerte der Stützpunkte errechnen
        curve.startPoint = [0, draw.yStart];
        curve.beziers.forEach((bezier, index) => {
            if (index < curve.beziers.length - 1) {
                // SP = "Stützpunkt"
                // Mitte zwischen dem zweiten SP der Kurve und dem ersten SP der drauffolgenden Kurve

                bezier.endPoint = [
                    (bezier.p2[0] + curve.beziers[index + 1].p1[0]) / 2,
                    (bezier.p2[1] + curve.beziers[index + 1].p1[1]) / 2,
                ]
            }
        })
        curve.beziers[curve.beziers.length - 1].endPoint = [elements.c.width, draw.yEnd];
        // console.log(curve);
    },
    step() {
        // console.clear()
        // console.log(settings);

        // elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);
        if (settings.fileNo % settings.fadeAfterFrames == 0) {
            elements.ctx.fillStyle = 'rgba(0,0,0,.05)'
            elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height);
        }

        for (let i = 0; i < settings.numIterations; i++) {

            settings.points.forEach(point => point.draw());
            settings.attractors.forEach(attr => attr.draw());

            settings.counter++

            // draw.renderCurve();
            draw.addCurve();
            let delta = settings.deltaPosStartEnd;
            // draw.yStart += rnd(-delta * 1000, delta * 1000) / 1000;
            // draw.yEnd += rnd(-delta * 1000, delta * 1000) / 1000;

            draw.yStart += settings.deltaPosStart;
            if (draw.yStart > elements.c.height || draw.yStart < 0)
                settings.deltaPosStart *= -1

            draw.yEnd += settings.deltaPosEnd;
            if (draw.yEnd > elements.c.height || draw.yEnd < 0)
                settings.deltaPosEnd *= -1

            // Farben 
            settings.hue += rnd(-settings.deltaHue * 100, settings.deltaHue * 100) / 100;
        }
        // Falls die Anzahl Kurven erreicht wurde, entferne die ersten paar wieder
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
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        settings.points = [...new Array(settings.numPoints)].map(() => new Point())
        settings.attractors = [...new Array(settings.numAttractors)].map(() => new Attractor())

        console.log(settings);

        draw.yStart = rnd(elements.c.height / 3, elements.c.height / 3 * 2);
        draw.yEnd = rnd(elements.c.height / 3, elements.c.height / 3 * 2);

        draw.animate();
    }
}

export default draw;
export let render = draw.render;