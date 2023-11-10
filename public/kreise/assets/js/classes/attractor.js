'use strict';

import helpers, { rnd } from '../../../../modules/helpers.js';
import settings, { elements } from '../../../../modules/settings.js';

class Attractor {
    constructor() {
        // console.log(settings.padding, elements.c.width);
        this.x = rnd(0, elements.c.width);
        this.y = rnd(0, elements.c.height);
        this.vx = rnd(-20, 20) / 300;
        this.vy = rnd(-20, 20) / 300;
        this.strength =.5;
        this.size = 0;
    }

    move() {
        this.x += this.vx / (1 / this.size);
        this.y += this.vy / (1 / this.size);
    }
    draw() {

        // let div = Math.sin(divisor / 180 * Math.PI) / 3 + 1.5;
        let ctx = elements.ctx;

        ctx.fillStyle = '#000';
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );

        this.move();
        this.checkBorders();

    }
    checkBorders() {
        let c = elements.c
        if (this.x > c.width) this.x = 0;
        if (this.x < 0) this.x = c.width;
        if (this.y > c.height) this.y = 0;
        if (this.y < 0) this.y = c.height;
    }
}


export default Attractor;