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

        let ctx = elements.ctx;
        this.searchNearest();
        // console.log(nearest);
        this.nearest.forEach(nearest => {

            if (nearest.distance < settings.threshold) {
                let bright = 1- (nearest.distance / settings.threshold);
                // console.log(bright);
                ctx.strokeStyle = `hsla(0,0%,100%,${bright})`;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(nearest.x, nearest.y);
                ctx.stroke();
            }
        })

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
            if (settings.attractors.length) {
                this.vx /= settings.borderDamper;
                this.vy /= settings.borderDamper;
            }
        }
        if (this.x < 0) {
            this.x = c.width;
            if (settings.attractors.length) {
                this.vx /= settings.borderDamper;
                this.vy /= settings.borderDamper;
            }
        }
        if (this.y > c.height) {
            this.y = 0;
            if (settings.attractors.length) {
                this.vx /= settings.borderDamper;
                this.vy /= settings.borderDamper;
            }
        }
        if (this.y < 0) {
            this.y = c.height;
            if (settings.attractors.length) {
                this.vx /= settings.borderDamper;
                this.vy /= settings.borderDamper;
            }
        }
    }
    searchNearest() {
        // Hier können mehrere nächste gesucht werden 
        // Oder es kann versucht werden, Ketten zu bilden
        // Lokale Kopie, die verändert werden kann
        let points = settings.points;
        for (let i in this.nearest) {
            let nearest = points.reduce((nearest, point) => {
                if (point != this) {
                    point.distance = helpers.pythagorasPoints(point, this);
                    if (point.distance < nearest.distance) return point;
                    else return nearest;
                } else {
                    return nearest
                }
            }, {
                distance: Infinity
            });
            this.nearest[i] = nearest;
            points = points.filter(point => point != nearest);
        }
        // return nearest;
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