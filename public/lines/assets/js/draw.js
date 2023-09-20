'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { RtA, rnd, lead0 } from '../../../modules/helpers.js';
import dom from '../../../modules/dom.js';
import noises, { Perlin } from '../../../modules/noises.js';
import ajax from '../../../modules/ajax.js';

let zoom = 100;
let speedX = .5, speedY = 1, speedZ = 2;
let fileNo = 0;

const draw = {

    render() {

        let c = elements.c;
        let ctx = c.getContext('2d');

        let lastPoint = false;

        let startPoint = { x: 100, y: 100 };
        let controlPoint1 = { x: 200, y: 50 };
        let controlPoint2 = { x: 200, y: 150 };
        let endPoint = { x: 100, y: 200 };

        let t = 0;
        let padding = 20;

        const drawLine = (x, y) => {
            // debugger;
            ctx.beginPath();
            ctx.arc(x, y, .5, 0, 2 * Math.PI);

            if (lastPoint) ctx.moveTo(...lastPoint);
            else ctx.moveTo(startPoint.x, startPoint.y);

            ctx.lineTo(x, y);
            lastPoint = [x, y];

            ctx.strokeStyle = '#000';
            ctx.lineWidth = c.width / 2000;
            ctx.stroke();
        }

        const createNumber = (min, max) => ~~(Math.random() * (max - min + 1) + min);

        const animate = () => {
            const x = Math.pow(1 - t, 3) * startPoint.x + 3 * Math.pow(1 - t, 2) * t * controlPoint1.x + 3 * (1 - t) * Math.pow(t, 2) * controlPoint2.x + Math.pow(t, 3) * endPoint.x;
            const y = Math.pow(1 - t, 3) * startPoint.y + 3 * Math.pow(1 - t, 2) * t * controlPoint1.y + 3 * (1 - t) * Math.pow(t, 2) * controlPoint2.y + Math.pow(t, 3) * endPoint.y;

            drawLine(x, y);

            t += 0.01;

            if (t >= .9) {
                ctx.fillStyle = 'rgba(255,255,255,.02)';
                ctx.fillRect(0, 0, c.width, c.height);

                controlPoint1 = {
                    x: endPoint.x,
                    y: endPoint.y,
                }

                startPoint = { x, y };

                endPoint = {
                    x: createNumber(padding, c.width - padding),
                    y: createNumber(padding, c.height - padding),
                }
                controlPoint2 = {
                    x: createNumber(padding, c.width - padding),
                    y: createNumber(padding, c.height - padding),
                }
                t = 0;
                //   console.log(startPoint, endPoint);
            }
            // requestAnimationFrame(animate);



            ajax.saveCanvasToServer(c, `image_${lead0(fileNo, 6)}.png`).then(
                () => {
                    fileNo++;
                    animate()
                }
            ).catch(
                console.warn
            )

        }

        
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, c.width, c.height);
        animate();


    }
}

export default draw;
export let render = draw.render;