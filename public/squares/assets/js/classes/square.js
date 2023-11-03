'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd } from '/modules/helpers.js';

class Square {
    constructor() {
        let c = elements.c;
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.counter = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.squares = [[this.x, this.y]];
        this.lineWidth = .6;
        this.hue = rnd(0, 360);
        this.lifetime = rnd(200, 400);
    }
    update() {
        
        this.checkLength();
        this.render();
    }

    checkLength() {
        
    }
    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        this.counter++;

        ctx.strokeStyle = `hsla(${this.hue},100%,50%,.5)`;
        
        ctx.stroke();
    }
}

export default Square;