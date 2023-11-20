'use strict';

import settings, { elements } from "/modules/settings.js";
import helpers, { rnd } from '/modules/helpers.js';

class Point {
    constructor() {
        this.x = rnd(0, settings.cSize.x);
        this.y = rnd(0, settings.cSize.y);
        this.v = rnd(-.2 * 1000, .2 * 1000) / 1000;
        this.angle = rnd(0, 360) / 180 * Math.PI;
        this.hue = rnd(0, 360);
    }

    update() {

        this.render();
    }

    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        // console.log(this);
        ctx.fillStyle = `hsl(${this.hue},100%,50%)`;
        ctx.fillRect(this.x, this.y, 8, 8);
    }
}

export default Point;
