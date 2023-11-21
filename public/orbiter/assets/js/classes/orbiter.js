'use strict';

import settings, { elements } from "/modules/settings.js";
import helpers, { rnd } from '/modules/helpers.js';

class Orbiter {
    constructor() {
        this.x = rnd(0, settings.cSize.x);
        this.y = rnd(0, settings.cSize.y);
        this.v = rnd(-.8 * 1000, .8 * 1000) / 1000;
        this.angle = rnd(0, 360) / 180 * Math.PI;
        this.hue = rnd(0, 50);
        this.deltaHue = 1;
        this.line = [];
        this.lineMaxLength = 20;
        this.lineWidth = .5;
    }

    update() {
        this.findNearestPoint();

        let deltaX = Math.sin(this.angle) * this.v;
        let deltaY = Math.cos(this.angle) * this.v;
        this.x += deltaX;
        this.y += deltaY;
        this.line.push([this.x, this.y]);
        if (this.line.length > this.lineMaxLength) this.line.splice(0, this.line.length - this.lineMaxLength);
        this.hue += rnd(-this.deltaHue * 100, this.deltaHue * 100) / 100;
        /*
        this.rotierePunkt(
            this.x, this.y,
            this.nearest.x, this.nearest.y,
            1 / this.distance * this.v
        );
        */
        this.render();
    }
    rotierePunkt(px, py, cx, cy, winkel) {
        // Umwandlung des Winkels von Grad in Radiant
        // winkel = winkel * Math.PI / 180.0;

        // Verschieben des Ursprungs zum Mittelpunkt der Rotation
        let dx = px - cx;
        let dy = py - cy;

        // Durchführung der Rotation
        let dxRotiert = dx * Math.cos(winkel) - dy * Math.sin(winkel);
        let dyRotiert = dx * Math.sin(winkel) + dy * Math.cos(winkel);

        // Verschieben des Ursprungs zurück zum ursprünglichen Punkt
        let pxRotiert = dxRotiert + cx;
        let pyRotiert = dyRotiert + cy;

        this.x = pxRotiert;
        this.y = pyRotiert;
    }
    findNearestPoint() {
        this.nearest = settings.points.reduce((nearest, point) => {
            point.distance = helpers.pythagorasPoints(this, point);
            if (point.distance < nearest.distance) {
                return point;
            } else {
                return nearest;
            }
        }, {
            distance: Infinity
        })

        // this.hue = this.nearest.hue;
        this.light = ~~(50 / this.nearest.distance * settings.thresholdDistance);
        this.distance = this.nearest.distance;
        // sin a = gk/hyp
        // a = asin (gk / hyp)
        // Unvollständig
        // this.angle = Math.asin((this.y - this.nearest.y) / this.nearest.distance);
        // atan ist der richtige Weg
        let deltaX = this.nearest.x - this.x;
        let deltaY = this.nearest.y - this.y;
        this.angle = Math.atan2(deltaY, deltaX);

        // console.log((this.y - nearest.y), nearest.distance);

    }

    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        /*
        console.log(this.angle);
        console.log(`hsl(${this.hue},${Math.abs(this.angle / Math.PI * 180) / 3.6}%,${this.light}%)`);
        */
        // ctx.fillStyle = `hsl(${this.hue},${Math.max((this.angle / Math.PI * 180) / 1.6, 30)}%,${Math.max(80, this.light)}%)`;
        ctx.strokeStyle = `hsl(${this.hue},100%,${80, this.light}%)`;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(...this.line[0]);
        for (let i = 1; i < this.line.length; i++) {
            ctx.lineTo(...this.line[i]);
        }

        ctx.stroke();
        // ctx.fillRect(this.x, this.y, 1, 1);
        // ctx.fillText(this.angle * 180 /Math.PI, this.x, this.y)
    }
}

export default Orbiter;
