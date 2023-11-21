'use strict';

import settings, { elements } from "/modules/settings.js";
import helpers, { rnd } from '/modules/helpers.js';

class Orbiter {
    constructor() {
        this.x = rnd(0, settings.cSize.x);
        this.y = rnd(0, settings.cSize.y);
        this.v = rnd(.2 * 1000, .4 * 1000) / 1000;
        if (Math.random() > .5) this.v *= -1;
        this.angle = rnd(0, 360) / 180 * Math.PI;
        this.hue = settings.hue;
        this.deltaHue = 1;
        this.line = [];
        this.lineMaxLength = 150;
        this.lineWidth = 1;
        this.traegheit = 8e-2;
        this.killMe = false;
        settings.hue += rnd(-settings.deltaHue * 100, settings.deltaHue * 200) / 100;
    }

    update() {
        this.findNearestPoint();

        if (this.killMe) {
            this.line.splice(0, 1);
            if (this.line.length <= 0) {
                settings.orbiters = settings.orbiters.filter(o => o != this);
                settings.orbiters.push(new Orbiter());
            }
        } else {
            let deltaX = Math.cos(this.angle) * this.v;
            let deltaY = Math.sin(this.angle) * this.v;

            this.x += deltaX;
            this.y += deltaY;
            let deltaAngle = this.angle - this.angleToPoint;
            if (deltaAngle > Math.PI) {
                deltaAngle -= 2 * Math.PI;
            } else if (deltaAngle < -Math.PI) {
                deltaAngle += 2 * Math.PI;
            }
            this.deltaAngle = deltaAngle
            this.angle -= deltaAngle / this.distance ** 1.5 / this.traegheit

            // this.updateNewton();
            this.line.push([this.x, this.y]);
            if (this.line.length > this.lineMaxLength) this.line.splice(0, this.line.length - this.lineMaxLength);
            this.hue += rnd(-this.deltaHue * 100, this.deltaHue * 100) / 100;
            this.checkborders()
        }

        this.render();

        if (this.distance < 5) {
            this.killMe = true;
        }
    }

    checkborders() {
        if (this.x > settings.cSize.x) this.killMe = true
        if (this.x < 0) this.killMe = true
        if (this.y > settings.cSize.y) this.killMe = true
        if (this.y < 0) this.killMe = true
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
        // console.log(this.nearest);
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
        this.angleToPoint = Math.atan2(deltaY, deltaX);
        this.angleToPoint += (Math.PI * 2);
        this.angleToPoint %= (Math.PI * 2);
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
        ctx.strokeStyle = `hsl(${this.hue},100%,${Math.max(80, this.light)}%)`;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        if (this.line.length) {
            ctx.moveTo(...this.line[0]);
            for (let i = 1; i < this.line.length; i++) {
                ctx.lineTo(...this.line[i]);
            }
        }

        ctx.stroke();
        // ctx.fillRect(this.x, this.y, 1, 1);
        let output = this.angle.toFixed(2) +
            ' | ' +
            this.angleToPoint.toFixed(2) +
            ' | ' +
            this.deltaAngle.toFixed(2);
        // ctx.fillText(output, this.x, this.y)
    }
}

export default Orbiter;
