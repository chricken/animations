'use strict';

import settings, { elements } from '../../../modules/settings.js';

let c = false, ctx = false;

class MandelbrotFractal {
    constructor() {
        c = elements.c;
        ctx = c.getContext('2d');
        this.imageData = ctx.createImageData(c.width, c.height);
    }

    draw() {
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                // let m = this.mandelbrot(x / (c.width / 3.5) - 2.5, y / (c.height / 3.5) - 1.0);
                let m = this.mandelbrot(x / (c.width / 3.5) - 2.5, y / (c.height / 2) - 1.0);
                this.drawPixel(x, y, m, m, m, 255);
            }
        }
        ctx.putImageData(this.imageData, 0, 0);
    }

    mandelbrot(x, y) {
        let real = x;
        let imag = y;
        for (var counter = 0; counter < 255; counter++) {
            let r2 = real * real;
            let i2 = imag * imag;
            if (r2 + i2 > 4.0) {
                return counter;
            }
            imag = 2 * real * imag + y;
            real = r2 - i2 + x;
        }
        return counter;
    }

    drawPixel(x, y, r, g, b, a) {
        let index = (x + y * c.width) * 4;
        this.imageData.data[index + 0] = r;
        this.imageData.data[index + 1] = g;
        this.imageData.data[index + 2] = b;
        this.imageData.data[index + 3] = a;
    }

    // Eine bestimmte Zoom-Position anspringen
    draw(startX, startY, endX, endY) {
        const scaleX = (endX - startX) / c.width;
        const scaleY = (endY - startY) / c.height;

        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                let m = this.mandelbrot(startX + x * scaleX, startY + y * scaleY);
                this.drawPixel(x, y, m, m, m, 255);
            }
        }
        ctx.putImageData(this.imageData, 0, 0);
    }
}

export default MandelbrotFractal;