'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd } from '/modules/helpers.js';

class Point {
    constructor() {
        let c = elements.c;
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.counter = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.lines = [[[this.x, this.y]]];
        this.v = rnd(1 * 1000, 3 * 1000) / 1000;
        this.maxLength = rnd(30, 50);
        this.lineWidth = .6;
        this.hue = rnd(0, 360);
        this.angleAmp = 14;
        this.lifetime = rnd(200, 400);
    }
    update() {
        if (settings.noise[~~this.y] && settings.noise[~~this.y][~~this.x]) {
            this.angle = settings.noise[~~this.y][~~this.x] * 2 * Math.PI * this.angleAmp;
        }
        [this.x, this.y] = helpers.moveByAngleSpeed(this.x, this.y, this.angle, this.v);
        // console.log(this.x, this.y);

        this.checkBorders()

        let currentLine = this.lines[this.lines.length - 1];
        currentLine.push([this.x, this.y]);

        this.checkLength();
        this.render();
    }
    checkBorders() {
        if (this.x < 0) {
            this.x = elements.c.width;
            this.lines.push([])
        }
        if (this.y < 0) {
            this.y = elements.c.height;
            this.lines.push([])
        }
        if (this.x > elements.c.width) {
            this.x = 0;
            this.lines.push([])
        }
        if (this.y > elements.c.height) {
            this.y = 0;
            this.lines.push([])
        }
    }
    checkLength() {
        let flat = this.lines.flat();
        // console.log(flat);
        if (flat.length > this.maxLength) {
            this.lines[0].splice(0, 1);
            if (this.lines[0].length == 0) {
                this.lines.splice(0, 1);
            }
        }
    }
    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        this.counter++;

        ctx.strokeStyle = `hsla(${this.hue},100%,50%,.5)`;
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        this.lines.forEach(line => {
            if (line[0] && this.counter < this.lifetime) {
                ctx.moveTo(...line[0])
                line.forEach(point => ctx.lineTo(...point));
            } else {
                // console.log(this.lines);
                settings.points = settings.points.filter(point => point != this);
                settings.points.push(new Point());
            }
        })
        ctx.stroke();
        // ctx.fillRect(this.x, this.y, 2, 2);
    }
}

export default Point;