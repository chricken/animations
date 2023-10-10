'use strict';

import settings, { elements } from '/public/modules/settings.js';
import helpers, { rnd } from '/public/modules/helpers.js';
import noises, { Perlin } from '/public/modules/noises.js';
import dom, { create } from '/public/modules/dom.js';

class Noise {
    constructor({
        transform = [0, 0, 0],
        transformMove = [
            rnd(-20, 20) / 10,
            rnd(-20, 20) / 10,
            rnd(-20, 20) / 10,
        ],
        zoom = 200,
    } = {}) {
        this.seedMap = false;
        this.c = false;
        this.ctx = false;

        Object.assign(this, { transform, transformMove, zoom })
    }

    init() {
        this.c = create({
            type: 'canvas',
            attr: {
                width: settings.canvasSize.width,
                height: settings.canvasSize.height,
            },
            classes: ['perlin'],
            parent: document.body
        })
        this.ctx = this.c.getContext('2d');

        this.seedMap = new Uint8Array([
            ...[...new Array(6)].map(() => rnd(1, 254)),
            ...(() => {
                let p = [], i;
                for (i = 0; i < 256; i++) p[i] = i;
                for (i = 0; i < 255; i++) {
                    let t, j = Math.floor((i + 1) * Math.random());
                    t = p[j]; p[j] = p[j + 1]; p[j + 1] = t;
                }
                return p;
            })()]);

        this.perlin = new Perlin(this.seedMap);
        this.render();
    }
    update() {
        this.transform = this.transform.map((val, index) => val + this.transformMove[index]);
        this.render();
    }
    render() {
        // console.log(settings.z);

        this.imgData = this.ctx.getImageData(0, 0, this.c.width, this.c.height);

        // Matrix verschieben
        this.transform = this.transform.map((val, index) => val + this.transformMove[index]);

        let data = this.imgData.data;
        for (let i = 0; i < data.length; i += 4) {

            let x = ((i / 4) % this.imgData.width);
            let y = Math.floor((i / 4) / this.imgData.width);
            let z = 0;

            [x, y, z] = [
                x + this.transform[0],
                y + this.transform[1],
                z + this.transform[2]
            ];
            [x, y, z] = [x / this.zoom, y / this.zoom, z / this.zoom];

            let valR = this.perlin.noise(x, y, z);
            let valG = this.perlin.noise(x * .5, y, z);
            let valB = this.perlin.noise(y, x, z);

            // Wert (-1 -> 1) in (0 - 255) umwandeln
            [valR, valG, valB] = [valR, valG, valB].map(val => (val + 1) * 128 - 1);
            data[i] = valR;
            data[i + 1] = valG;
            data[i + 2] = valB;
            data[i + 3] = 255;

        }
        // console.log(imgData);
        this.ctx.putImageData(this.imgData, 0, 0);

    }
}

export default Noise;