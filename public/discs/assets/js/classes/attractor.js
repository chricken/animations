'use strict';

import helpers, { rnd } from '../../../../modules/helpers.js';
import settings, { elements } from '../../../../modules/settings.js';

const speeds = [.5,.3,.8,-.4,-.7];

class Attractor {
    constructor() {
        // console.log(settings.padding, elements.c.width);
        this.x = rnd(0, elements.c.width);
        this.y = rnd(0, elements.c.height);
        this.vx =speeds[(rnd(0,speeds.length-1))]/3;
        this.vy = speeds[(rnd(0,speeds.length-1))]/3;
        this.strength = 2;
        this.size = 10;
    }

    move() {
        this.x += this.vx / (1 / this.size);
        this.y += this.vy / (1 / this.size);
    }
    draw() {

        // let div = Math.sin(divisor / 180 * Math.PI) / 3 + 1.5;
        let ctx = elements.ctx;

        ctx.fillStyle = '#f00';
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