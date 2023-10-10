'use strict';

import settings, { elements } from '/public/modules/settings.js';

class Point {
    constructor(x, y) {
        this.posX = x;
        this.posY = y;
        this.speedX = 0;
        this.speedY = 0;
        this.size = 3;
        this.multiplyerSpeed = .01;
    }

    render() {
        let ctx = elements.ctxLines;
        ctx.fillStyle = 'rgba(255,255,255,.3';
        ctx.fillStyle = `rgb(${this.color.join(',')})`;

        ctx.fillRect(
            this.posX,
            this.posY,
            this.size,
            this.size,
        )
    }

    update() {
        let index = ~~((settings.imgData.width * this.posY) + this.posX) * 4;
        // console.log(index);
        this.color = [
            settings.imgData.data[index],
            settings.imgData.data[index + 1],
            settings.imgData.data[index + 2]
        ]

        // console.log((this.color[0] - 128), this.multiplyerSpeed);
        this.speedX += (this.color[0] - 128) * this.multiplyerSpeed
        this.speedY += (this.color[1] - 128) * this.multiplyerSpeed

        this.posX += this.speedX;
        this.posY += this.speedY;

        if (this.posX < 0) {
            this.posX = elements.cLines.width;
            // this.speedX = 0
            // this.speedY = 0
        }
        if (this.posX > elements.cLines.width) {
            this.posX = 0;
            // this.speedX = 0
            // this.speedY = 0
        }
        if (this.posY < 0) {
            this.posY = elements.cLines.height;
            // this.speedX = 0
            // this.speedY = 0
        }
        if (this.posY > elements.cLines.height) {
            this.posY = 0;
            // this.speedX = 0
            // this.speedY = 0
        }

        // console.log(this);
        this.render();
    }
}

export default Point;