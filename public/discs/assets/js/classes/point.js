'use strict';

import helpers, { rnd } from '../../../../modules/helpers.js';
import settings, { elements } from '../../../../modules/settings.js';

class Point {
    constructor() {
        let max = .5
        // console.log(settings.padding, elements.c.width);
        this.x = rnd(0, elements.c.width);
        this.y = rnd(0, elements.c.height);
        this.vx = rnd(-100, 200) / 500;
        this.vy = rnd(-100, 200) / 500;

        /*if (this.vx < max/10 && this.vx > 0) this.vx = max/10;
        if (this.vy < max/10 && this.vy > 0) this.vy = max/10;
        if (this.vx > -max/10 && this.vx < 0) this.vx = -max/10;
        if (this.vy > -max/10 && this.vy < 0) this.vy = -max/10;
        */
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
            if (point != this) {
                point.lastDistance = point.distance;
                point.distance = helpers.pythagorasPoints(this, point);
                // if (Math.abs(point.distance - point.lastDistance) > settings.maxAbweichung){
                // point.distance = point.lastDistance;
                // }
                nearest = (point.distance < nearest.distance) ? point : nearest;
            }
        }
        this.nearestDistance = ~~nearest.distance;
        let hue = 255 - (nearest.distance * 2) / settings.threshold * 255
        // console.log(`hsla(0,0%,100%,${1 - (nearest.distance * 2) / settings.threshold})`);
        ctx.fillStyle = `hsl(${hue},100%,50%,${1 - (nearest.distance * 2) / settings.threshold})`;
        let radius = nearest.distance / 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();

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
        if (this.x > c.width + settings.threshold) {
            this.x = -settings.threshold;
            // this.vx = 0;
            // this.vy = 0;
        }
        if (this.x < -settings.threshold) {
            this.x = c.width + settings.threshold;
            // this.vx = 0;
            // this.vy = 0;
        }
        if (this.y > c.height + settings.threshold) {
            this.y = -settings.threshold;
            // this.vx = 0;
            // this.vy = 0;
        }
        if (this.y < -settings.threshold) {
            this.y = c.height + threshold;
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