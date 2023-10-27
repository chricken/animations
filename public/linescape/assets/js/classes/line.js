'use strict';
import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';

class Line {
    constructor() {
        // Y-Ablenkung aller Punkte
        // Die X-Position wird anhand der Anzahl an Punkten automatisch ermittelt
        this.points = [...new Array(100)].map(() => Math.random() * .1 - .05);
        this.posY = 0;
    }
    update() {
        if (this.posY > .5){
            settings.lines = settings.lines.filter(line => line != this);
        }
        this.posY += .005;
        this.draw();
    }
    draw() {
        let c = elements.c;
        let ctx = elements.ctx;

        ctx.strokeStyle = '#fff';

        ctx.moveTo(-10, (c.height * this.posY))

        this.points.forEach((point, index) => {

            ctx.lineTo(
                c.width / (this.points.length - 1) * index,
                (c.height * this.posY) + (c.height * point)
            )

        })
        ctx.stroke();
    }
}

export default Line;