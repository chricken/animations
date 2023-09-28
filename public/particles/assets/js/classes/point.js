'use strict';

import helpers, { rnd } from '../../../../modules/helpers.js';
import settings, { elements } from '../../../../modules/settings.js';

class Point {
    constructor() {
        // console.log(settings.padding, elements.c.width);
        this.x = rnd(0, elements.c.width);
        this.y = rnd(0, elements.c.height);
        this.vx = rnd(-20, 20) / 50;
        this.vy = rnd(-20, 20) / 50;
        this.size = rnd(.1, 1);
    }
    draw() {

        // let div = Math.sin(divisor / 180 * Math.PI) / 3 + 1.5;
        let ctx = elements.ctx;

        ctx.fillStyle = '#fff';
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );

        this.move();
        this.checkBorders();

    }
    move() {
        let vy = this.vy;
        settings.attractors.forEach(attr => {
            let distance = helpers.pythagoras(this.x - attr.x, this.y - attr.y);
            this.vx += ((attr.x - this.x) * this.size) / (distance**2) * attr.strength;
            this.vy += ((attr.y - this.y) * this.size) / (distance**2) * attr.strength;
        })
        this.x += this.vx / (1 / this.size);
        this.y += this.vy / (1 / this.size);
    }
    checkBorders() {
        let c = elements.c
        if (this.x > c.width) {
            this.x = 0;
            this.vx = 0;
            this.vy = 0;
        }
        if (this.x < 0) {
            this.x = c.width;
            this.vx = 0;
            this.vy = 0;
        }
        if (this.y > c.height) {
            this.y = 0;
            this.vx = 0;
            this.vy = 0;
        }
        if (this.y < 0) {
            this.y = c.height;
            this.vx = 0;
            this.vy = 0;
        }
    }
}

class Attractor {
    constructor() {
        // console.log(settings.padding, elements.c.width);
        this.x = rnd(0, elements.c.width);
        this.y = rnd(0, elements.c.height);
        this.vx = 0;
        this.vy = 0;
        this.strength = 1;
    }

}


export default Point;