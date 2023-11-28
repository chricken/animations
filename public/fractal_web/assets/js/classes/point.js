'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hue = settings.hue;
        settings.hue += settings.deltaHue;
    }

    render() {
        let c = elements.c;
        let ctx = elements.ctx;

        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`
        ctx.fillRect(this.x, this.y, 1,1);
    }
}

export default Point;