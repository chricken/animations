'use strict';


import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';

class Line {
    constructor(posY) {
        this.posY = posY;
        this.y = settings.fileNo;
        this.z = 0;
        this.deltaZ = .01;
        this.rough = .05;
        this.lineThickness = 20;
        this.hue = ~~settings.hue;
        settings.hue += rnd(-settings.deltaHue * 10000, settings.deltaHue * 10000) / 10000;
        this.points = [...new Array(settings.numPoints)].map(
            (val, index) => {
                // debugger;
                let height = settings.perlin.noise((index * .01), this.y / 40, 0);
                let addHeight = settings.perlin.noise((index * .2), this.y / 1000, 0) / 15;
                height += addHeight;
                height += 1; // Negative Zahlen anheben
                height *= this.rough;   // Zahlen auf Anteile von 1 drücken
                // height += rnd(-100, 100)/500000;


                return height;
                // rnd(this.rough * 1000, -this.rough * 1000) / 1000
            }
        );
        settings.moveX += settings.addX;
        this.speedY = .001;
    }
    update() {
        this.posY += (this.speedY) + ((this.speedY * settings.acc) * this.posY);

        // Punkte updaten
        this.points = this.points.map(
            (val, index) => {
                // debugger;
                let height = settings.perlin.noise((index * .01), this.y / 40, this.z);
                let addHeight = settings.perlin.noise((index * .2), this.y / 1000, this.z*2) / 15;
                height += addHeight;
                height += 1; // Negative Zahlen anheben
                height *= this.rough;   // Zahlen auf Anteile von 1 drücken
                // height += rnd(-100, 100)/500000;


                return height;
                // rnd(this.rough * 1000, -this.rough * 1000) / 1000
            }
        );

        // Z-Position
        this.z += this.deltaZ;

        // if (this.posY > 1 + this.rough) {
        if (this.posY > (1 + this.rough * 2)) {
            settings.lines = settings.lines.filter(line => line != this);
        } else {
            this.render();
        }
    }
    render() {
        let c = elements.c;
        let ctx = elements.ctx;
        let multiplikator = settings.acc * this.posY;


        ctx.fillStyle = '#000';
        ctx.lineJoin = 'round';
        ctx.lineWidth = this.posY * multiplikator * this.lineThickness;
        ctx.lineWidth = Math.max(ctx.lineWidth, 1);
        // ctx.lineWidth = this.posY * multiplikator;
        /*
        ctx.beginPath();
        ctx.moveTo(0, this.posY * c.height);
        */
        ctx.beginPath();
        ctx.moveTo(-100, this.posY);
        for (let i = 1; i < this.points.length; i++) {

            let point = this.points[i];
            let pointBefore = this.points[i - 1];

            let x = c.width / (this.points.length - 1) * i;
            x *= 1 + multiplikator;
            x -= (c.width * multiplikator / 2);

            let xBefore = c.width / (this.points.length - 1) * (i - 1);
            xBefore *= 1 + multiplikator;
            xBefore -= (c.width * multiplikator / 2);

            let y = (point * c.height);
            y *= multiplikator * .8;

            let yBefore = (pointBefore * c.height);
            yBefore *= multiplikator;

            // console.clear();
            // console.log(point, this.hue,100 - ~~(point*500));

            // ctx.strokeStyle = `hsl(${this.hue},${100 - ~~(point*50)}%,50%)`;
            ctx.strokeStyle = `hsla(${this.hue},100%,50%,1)`;
            // ctx.strokeStyle = `hsla(${this.hue},100%,50%,.5)`;

            // ctx.moveTo(xBefore, (this.posY * c.height) + yBefore);

            ctx.lineTo(
                x,
                (this.posY * c.height) + y
            )
            /*
            ctx.quadraticCurveTo(
                x, this.posY + y,
                x2, this.posY * c.height
            )
            */
        }
        ctx.stroke();
        ctx.lineTo(c.width * 2, c.height / 2);
        ctx.lineTo(c.width * 2, c.height * 2);
        ctx.lineTo(-c.width, c.height * 2);
        ctx.lineTo(-c.width, c.height / 2);
        ctx.fill()
    }

}

export default Line;
