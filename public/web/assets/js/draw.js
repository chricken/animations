'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import ajax from '../../../modules/ajax.js';
import classes from './classes.js';

let divisor = 1.5;
let fileNo = 0;

const draw = {

    render() {

        let c = elements.c;
        let ctx = c.getContext('2d');

        // let lastPoint = false;

        let points = [...new Array(settings.numPoints)].map(() => new classes.Point())

        // console.log(points);

        // let t = 0;

        const drawPoints = (x, y) => {
            // debugger;
            //ctx.arc(x, y, 1, 0, 2 * Math.PI);

            let div = Math.sin(divisor / 180 * Math.PI) / 3 + 1.5;

            points.forEach(target => {
                // console.clear()
                // console.log(target.x, target.y);
                if (target.x && x != target.x && y != target.y) {
                    let a = x - target.x;
                    let b = y - target.y;
                    let distance = Math.sqrt(a ** 2 + b ** 2);
                    distance /= c.width;
                    distance **= .1;
                    distance = 1 - distance;
                    ctx.strokeStyle = `rgba(255,255,255,${distance})`;
                    ctx.beginPath();
                    ctx.moveTo(target.x, target.y);
                    ctx.bezierCurveTo(
                        c.width / 2 - (c.width / 2 - target.x) / div, c.height / 2 - (c.height / 2 - target.y) / div,
                        c.width / 2 - (c.width / 2 - x) / div, c.height / 2 - (c.height / 2 - y) / div,
                        x, y
                    )
                    // ctx.lineTo(target.x, target.y);
                    ctx.stroke();
                }
            })

            /*
            ctx.beginPath();
            ctx.font = '50px';
            ctx.fillText(div, 50, 50);
            ctx.fill();
            */

        }

        const animate = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.fillStyle = 'rgba(255,255,255,.01)'
            // ctx.fillRect(0, 0, c.width, c.height)

            points.forEach((point) => {
                let t = point.t;
                point.x = Math.pow(1 - t, 3) * point.startPoint.x + 3 * Math.pow(1 - t, 2) * t * point.controlPoint1.x + 3 * (1 - t) * Math.pow(t, 2) * point.controlPoint2.x + Math.pow(t, 3) * point.endPoint.x;
                point.y = Math.pow(1 - t, 3) * point.startPoint.y + 3 * Math.pow(1 - t, 2) * t * point.controlPoint1.y + 3 * (1 - t) * Math.pow(t, 2) * point.controlPoint2.y + Math.pow(t, 3) * point.endPoint.y;

                drawPoints(point.x, point.y);

                point.t += point.step;

                if (t >= .9) {

                    point.controlPoint1 = {
                        x: point.endPoint.x,
                        y: point.endPoint.y,
                    }

                    point.startPoint = { x: point.x, y: point.y };

                    point.endPoint = {
                        x: rnd(settings.padding, c.width - settings.padding),
                        y: rnd(settings.padding, c.height - settings.padding),
                    }
                    point.controlPoint2 = {
                        x: rnd(settings.padding, c.width - settings.padding),
                        y: rnd(settings.padding, c.height - settings.padding),
                    }
                    point.t = 0;
                    // console.log(point.startPoint, point.endPoint);
                }

            })

            // Bogen verändern
            divisor += 1;
            requestAnimationFrame(animate);

            /*
            ajax.saveCanvasToServer(c, `image_${lead0(fileNo, 6)}.png`).then(
                () => {
                    fileNo++;
                    if (fileNo <= 10800) {
                        animate()
                    }
                }
            ).catch(
                console.warn
            )
                */

        }


        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, c.width, c.height);
        animate();


    }
}

export default draw;
export let render = draw.render;