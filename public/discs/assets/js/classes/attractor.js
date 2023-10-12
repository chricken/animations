'use strict';

import helpers, { rnd } from '../../../../modules/helpers.js';
import settings, { elements } from '../../../../modules/settings.js';

const speeds = [
    [.5,-.5],
    [.5,.5],
    [-.5,-.5],
    [-.5,.5],
    [.8,-.5],
    [.8,.5],
    [-.8,-.5],
    [-.8,.5],
    [.5,-.8],
    [.5,.8],
    [-.5,-.8],
    [-.5,.8],
    [0,-.8],
    [0,.8],
    [-.7,0],
    [-.7,0],
];

class Attractor {
    constructor() {
        // console.log(settings.padding, elements.c.width);
        this.x = rnd(0, elements.c.width);
        this.y = rnd(0, elements.c.height);
        let speed = speeds.splice(rnd(0,speeds.length-1), 1)[0];
        this.vx = speed[0];
        this.vy = speed[1];
        this.strength = 1;
        this.size = 3;
    }

    move() {
        this.x += this.vx / (1 / this.size);
        this.y += this.vy / (1 / this.size);
    }
    draw() {

        // let div = Math.sin(divisor / 180 * Math.PI) / 3 + 1.5;
        let ctx = elements.ctx;

        ctx.fillStyle = '#fff';
        ctx.beginPath()
        /*ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );*/
        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            2 * Math.PI
        )
        ctx.fill();

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