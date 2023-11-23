'use strict';

import settings, { elements } from "/modules/settings.js";
import helpers, { rnd } from '/modules/helpers.js';

class Point {
    constructor() {
        this.x = rnd(0, settings.cSize.x);
        this.y = rnd(0, settings.cSize.y);
        this.v = rnd(.2 * 1000, .5 * 1000) / 1000;
        if (Math.random() > .5) this.v *= -1;
        this.angle = rnd(0, 360) / 180 * Math.PI;
        this.hue = rnd(0, 360);
        this.collisionPadding = settings.cSize.x / 10;
        this.mass = 10e4;
    }

    update() {
        // gk = sin a *h
        // ak = cos a *h
        let deltaX = Math.sin(this.angle) * this.v;
        let deltaY = Math.cos(this.angle) * this.v;
        this.x += deltaX;
        this.y += deltaY;
        this.checkborders();
        this.render();
    }

    checkborders() {
        let divergenz = rnd(-100, 100) / 200;
        if (this.y < 0 - this.collisionPadding) this.angle = Math.PI - this.angle + divergenz;
        if (this.y > settings.cSize.y + this.collisionPadding) this.angle = Math.PI - this.angle + divergenz;

        if (this.x < -this.collisionPadding) this.angle = 2 * Math.PI - this.angle + divergenz;
        if (this.x > settings.cSize.x + this.collisionPadding) this.angle = 2 * Math.PI - this.angle + divergenz;
    }

    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        // console.log(this);
        ctx.fillStyle = `hsl(${this.hue},50%,70%)`;
        // ctx.fillRect(this.x, this.y, 5, 5);
        ctx.strokeStyle = 'hsl(0,50%,50%)'
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

export default Point;
