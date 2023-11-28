'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.speedX = rnd(-100, 100) / 500;
        this.speedY = rnd(-100, 100) / 500;

        this.hue = settings.hue;
        settings.hue += settings.deltaHue;

        this.winkel = rnd(0, 360) / 180 * Math.PI;
        this.haarLength = rnd(0, settings.cSize.x * settings.maxHaarLength);

        this.winkelSP = rnd(0, 360) / 180 * Math.PI;
        this.haarLengthSP = rnd(0, settings.cSize.x * settings.maxHaarLength);

        this.deltaX = this.haarLength * Math.cos(this.winkel);
        this.deltaY = this.haarLength * Math.sin(this.winkel);

        this.spX = this.haarLengthSP * Math.cos(this.winkelSP);
        this.spY = this.haarLengthSP * Math.sin(this.winkelSP);
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.checkBorders();
        this.render();
    }
    checkBorders() {
        if (this.x < 0) this.x = settings.cSize.x;
        if (this.y < 0) this.y = settings.cSize.y;
        if (this.x > settings.cSize.x) this.x = 0;
        if (this.y > settings.cSize.y) this.y = 0;
    }
    render() {
        let c = elements.c;
        let ctx = elements.ctx;

        if (
            settings.px[~~this.y] &&
            settings.px[~~this.y][~~this.x] &&
            settings.px[~~this.y][~~this.x].show
        ) {

            let val = settings.px[~~this.y][~~this.x].val;
            val -= settings.threshold.r;
            val *= 1 + settings.threshold.r;

            let length = this.haarLength * val;
            this.deltaX = length * Math.cos(this.winkel);
            this.deltaY = length * Math.sin(this.winkel);

            length = this.haarLengthSP * val;
            this.spX = length * Math.cos(this.winkelSP);
            this.spY = length * Math.sin(this.winkelSP);

            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`
            ctx.strokeStyle = `hsl(${this.hue}, 80%, 50%)`
            // ctx.lineWidth = settings.px[this.y][this.x].val;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.quadraticCurveTo(
                this.x + this.spX, this.y + this.spY,
                this.x + this.deltaX, this.y + this.deltaY
            );
            // ctx.lineTo(this.x + this.deltaX, this.y + this.deltaY);
            // ctx.fillRect(this.x, this.y, 1, 1);
            ctx.stroke();
        }




    }
}

export default Point;