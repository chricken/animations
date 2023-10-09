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
        this.size = rnd(.5, 2);
    }
    draw() {

        let nearest = { isDummy: true, distance: Infinity };
        let ctx = elements.c.getContext("2d");

        /*
        for (let i = 0; i < settings.points.length; i++) {
            let point = settings.points[i];
            point.inChain = false;
        };
        */
        for (let i = 0; i < settings.points.length; i++) {
            let point = settings.points[i];
            if (point != this && !point.inChain) {
                point.distance = helpers.pythagorasPoints(this, point);
                nearest = (point.distance < nearest.distance) ? point : nearest;
            }
        }
        if (!nearest.isDummy) {
            // console.log(this.x, this.y);
            // console.log(nearest.x, nearest.y);

            nearest.inChain = true;
            if (nearest.distance < settings.threshold) {
                // console.log(nearest.distance);
                ctx.strokeStyle = `hsla(0,0%,100%,${1-(nearest.distance*2) / settings.threshold})`;
                // console.log(ctx.strokeStyle);
                // console.log(' ');
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(nearest.x, nearest.y);
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.font = '16, arial';
                // ctx.fillText(~~nearest.distance, nearest.x + 10, nearest.y)
            }
            nearest.draw();
        }
        this.move();
        this.checkBorders();
    }
    move() {
        let vy = this.vy;
        settings.attractors.forEach(attr => {
            let distance = helpers.pythagoras(this.x - attr.x, this.y - attr.y);
            this.vx += ((attr.x - this.x) * this.size) / (distance ** 2) * attr.strength;
            this.vy += ((attr.y - this.y) * this.size) / (distance ** 2) * attr.strength;
        })
        this.x += this.vx / (1 / this.size);
        this.y += this.vy / (1 / this.size);
    }
    checkBorders() {
        let c = elements.c
        if (this.x > c.width) {
            this.x = 0;
            // this.vx = 0;
            // this.vy = 0;
        }
        if (this.x < 0) {
            this.x = c.width;
            // this.vx = 0;
            // this.vy = 0;
        }
        if (this.y > c.height) {
            this.y = 0;
            // this.vx = 0;
            // this.vy = 0;
        }
        if (this.y < 0) {
            this.y = c.height;
            // this.vx = 0;
            // this.vy = 0;
        }
    }
    searchNearest(chain = []) {
        // Hier können mehrere nächste gesucht werden 
        // Oder es kann versucht werden, Ketten zu bilden

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