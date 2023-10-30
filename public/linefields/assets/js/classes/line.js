'use strict';


import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';

class Line {
    constructor(posY) {
        this.posY = posY;
        this.rough = .003
        this.points = [...new Array(settings.numPoints)].map(
            () => rnd(this.rough * 1000, -this.rough * 1000) / 1000
        );
        this.speedY = .001;
        this.acc = 1.01;
    }
    update() {
        this.posY += (this.speedY) + ((this.speedY*10) * this.posY) ;
        // if (this.posY > 1 + this.rough) {
        if (this.posY > (1 + this.rough)) {
            settings.lines = settings.lines.filter(line => line != this);
        } else {
            this.render();
        }
    }
    render() {
        let c = elements.c;
        let ctx = elements.ctx;

        ctx.beginPath();
        ctx.moveTo(0, this.posX * c.height);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            ctx.lineTo(
                c.width / (this.points.length - 1) * i,
                (this.posY * c.height) + (point * c.height)
            )

        }
        ctx.stroke();

    }

}

export default Line;
