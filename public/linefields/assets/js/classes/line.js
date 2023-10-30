'use strict';


import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';

class Line {
    constructor(posY) {
        this.posY = posY;
        this.rough = .04
        this.points = [...new Array(settings.numPoints)].map(
            (val, index) => {
                // debugger;
                // let height = settings.perlin.noise(index, settings.fileNo, 0);
                let height = settings.perlin.noise((index * .01), settings.fileNo / 40, 0);
                let addHeight = settings.perlin.noise((index * .2), settings.fileNo / 1000, 0) / 15;
                height += addHeight;
                height += 1; // Negative Zahlen anheben
                height /= 30;   // Zahlen auf Anteile von 1 drücken
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


        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#000';
        ctx.lineJoin = 'round';
        ctx.lineWidth = Math.max(this.posY * multiplikator, 1);
        // ctx.lineWidth = this.posY * multiplikator;
        /*
        ctx.beginPath();
        ctx.moveTo(0, this.posY * c.height);
        */
        for (let i = 1; i < this.points.length; i++) {
            ctx.beginPath();
            
            let point = this.points[i];
            let pointBefore = this.points[i-1];
            
            let x = c.width / (this.points.length - 1) * i;
            x *= 1 + multiplikator;
            x -= (c.width * multiplikator / 2);
            
            let xBefore = c.width / (this.points.length - 1) * (i-1);
            xBefore *= 1 + multiplikator;
            xBefore -= (c.width * multiplikator / 2);
           
            let y = (point * c.height);
            y *= multiplikator*.8;

            let yBefore = (pointBefore * c.height);
            yBefore *= multiplikator;
            
            ctx.strokeStyle = `rgb(255,${255 - ~~(point*6000)},0)`;

            ctx.moveTo(xBefore, (this.posY * c.height) + yBefore);

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
            ctx.stroke();
        }
        /*
        ctx.lineTo(c.width * 2, c.height / 2);
        ctx.lineTo(c.width * 2, c.height * 2);
        ctx.lineTo(-c.width, c.height * 2);
        ctx.fill()
        */
    }

}

export default Line;
