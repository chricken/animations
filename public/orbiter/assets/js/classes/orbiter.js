'use strict';

import settings, { elements } from "/modules/settings.js";
import helpers, { rnd } from '/modules/helpers.js';

class Orbiter {
    constructor() {
        this.x = rnd(0, settings.cSize.x);
        this.y = rnd(0, settings.cSize.y);
        this.v = rnd(-.2 * 1000, .2 * 1000) / 1000;
        this.angle = rnd(0, 360) / 180 * Math.PI;
        this.hue = 240;
    }

    update() {
        this.findNearestPoint();
        this.render();
    }

    findNearestPoint() {
        let nearest = settings.points.reduce((nearest, point) => {
            point.distance = helpers.pythagorasPoints(this, point);
            if (point.distance < nearest.distance) {
                return point;
            } else {
                return nearest;
            }
        }, {
            distance: Infinity
        })

        this.hue = nearest.hue;
        this.light = ~~(50 / nearest.distance * settings.thresholdDistance);
        // sin a = gk/hyp
        // a = asin (gk / hyp)
        this.angle = Math.asin((this.y - nearest.y) / nearest.distance);
        // console.log((this.y - nearest.y), nearest.distance);

    }

    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        /*
        console.log(this.angle);
        console.log(`hsl(${this.hue},${Math.abs(this.angle / Math.PI * 180) / 3.6}%,${this.light}%)`);
        */
        ctx.fillStyle = `hsl(${this.hue},${(this.angle / Math.PI * 180) / 1.6}%,${this.light}%)`;
        ctx.fillRect(this.x, this.y, 4, 4);
    }
}

export default Orbiter;
