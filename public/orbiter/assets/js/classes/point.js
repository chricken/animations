'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd } from '/modules/helpers.js';

class Point {
    constructor(hue) {
        let c = elements.c;
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.angle = Math.random() * 2 * Math.PI;
        let v = .4;
        this.v = rnd(-v * 1000, v * 1000) / 1000;
    }
    update() {
        [this.x, this.y] = helpers.moveByAngleSpeed(this.x, this.y, this.angle, this.v);
        // console.log(this.x, this.y);

        this.checkBorders()

        this.render();
    }
    checkBorders() {
        if (this.x < 0) {
            this.x = elements.c.width;
        }
        if (this.y < 0) {
            this.y = elements.c.height;
        }
        if (this.x > elements.c.width) {
            this.x = 0;
        }
        if (this.y > elements.c.height) {
            this.y = 0;
        }
    }
    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        this.counter++;
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, 2, 2);
    }
}

export default Point;