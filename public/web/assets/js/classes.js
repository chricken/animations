'use strict';

import helpers, { rnd } from '../../../modules/helpers.js';
import settings, { elements } from '../../../modules/settings.js';

class Point {
    constructor() {
        // console.log(settings.padding, elements.c.width);
        this.startPoint = { x: rnd(settings.padding, elements.c.width), y: rnd(settings.padding, elements.c.height) };
        this.controlPoint1 = { x: rnd(settings.padding, elements.c.width), y: rnd(settings.padding, elements.c.height) };
        this.controlPoint2 = { x: rnd(settings.padding, elements.c.width), y: rnd(settings.padding, elements.c.height) };
        this.endPoint = { x: rnd(settings.padding, elements.c.width), y: rnd(settings.padding, elements.c.height) };
        this.step = rnd(5, 10) / 10000;
        this.t = 0;
    }
}

const classes = {
    Point,
}

export default classes;