'use strict';


import settings, { elements } from '../../../../modules/settings.js';
import helpers, { rnd, lead0 } from '../../../../modules/helpers.js';
import noises, { Perlin } from '../../../../modules/noises.js';

const addition = {
    // Ein Table mit zusätzlichen Werten, die auf die Distance gerechnet und 
    // damit den Aufbau etwas interessanter gestalten sollen
    fillAdditionTableSinus() {
        this.additionTable = [];

        // AdditionTables sollen grundsätzlich in einem Promise ausgeführt werden, damit man nicht immer umbauen muss, wenn Bilder benutzt werden
        return new Promise((resolve, reject) => {
            for (let y = 0; y < settings.cSize.y; y++) {
                this.additionTable.push([]);
                for (let x = 0; x < settings.cSize.x; x++) {
                    // Das Array soll mit Zahlen zwischen 0 und 1 gefüllt sein
                    this.additionTable[y].push((Math.sin(x * 180 / Math.PI) + 1) / 2);
                }
            }
            resolve();
        })
    },

    fillAdditionTablePerlin() {
        this.additionTable = [];

        // AdditionTables sollen grundsätzlich in einem Promise ausgeführt werden, damit man nicht immer umbauen muss, wenn Bilder benutzt werden
        return new Promise((resolve, reject) => {
            // Zufallswerte
            const p = new Uint8Array([
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

            const perlin = new Perlin(p);

            for (let y = 0; y < settings.cSize.y; y++) {
                this.additionTable.push([]);
                for (let x = 0; x < settings.cSize.x; x++) {

                    let [x1, y1, z1] = [x / this.noiseZoom, y / this.noiseZoom, 0];
                    let [x2, y2, z2] = [x / this.noiseZoom * 4, y / this.noiseZoom * 4, 100];
                    let [x3, y3, z3] = [x / this.noiseZoom * 20, y / this.noiseZoom * 20, 200];

                    let val1 = (perlin.noise(x1, y1, z1) + 1) / 2;
                    let val2 = (perlin.noise(x2, y2, z2) + 1) / 2;
                    let val3 = (perlin.noise(x3, y3, z3) + 1) / 2;
                    let val = ((val1 * 6) + (val2 *0) + (val3 * 0)) / 6;
                    val **= 1 / 3;

                    // Add Noise
                    val += Math.random() * this.addNoise;

                    // Das Array soll mit Zahlen zwischen 0 und 1 gefüllt sein
                    this.additionTable[y].push(val);
                }
            }

            // Julia in einen Canvas zeichnen
            const cAddition = document.createElement('canvas');
            const ctx = cAddition.getContext('2d');
            cAddition.width = settings.cSize.x;
            cAddition.height = settings.cSize.y;

            cAddition.style.width = cAddition.width / 2 + 'px';
            cAddition.style.height = cAddition.height / 2 + 'px';

            document.body.append(cAddition);

            // AdditionTable füllen
            const imgData = ctx.getImageData(0, 0, cAddition.width, cAddition.height);

            for (let y = 0; y < cAddition.height; y++) {
                for (let x = 0; x < cAddition.width; x++) {
                    let index = (y * cAddition.width + x) * 4;
                    imgData.data[index] = ~~(this.additionTable[y][x] * 255)
                    imgData.data[index + 1] = ~~(this.additionTable[y][x] * 255)
                    imgData.data[index + 2] = ~~(this.additionTable[y][x] * 255)
                    imgData.data[index + 3] = 255
                }
            }
            ctx.putImageData(imgData, 0, 0);

            resolve();
        })
    },

    fillAdditionTableImg() {
        this.additionTable = [];

        // AdditionTables sollen grundsätzlich in einem Promise ausgeführt werden, damit man nicht immer umbauen muss, wenn Bilder benutzt werden
        return new Promise((resolve, reject) => {

            const cAddition = document.createElement('canvas');
            const ctx = cAddition.getContext('2d');
            cAddition.width = settings.cSize.x;
            cAddition.height = settings.cSize.y;

            cAddition.style.width = cAddition.width / 2 + 'px';
            cAddition.style.height = cAddition.height / 2 + 'px';

            document.body.append(cAddition);
            console.log('FillAdditionTable');

            // Bild laden
            const imgAddition = document.createElement('img');
            imgAddition.addEventListener('load', () => {
                ctx.drawImage(imgAddition, 0, 0, cAddition.width, cAddition.height);

                // AdditionTable füllen
                const imgData = ctx.getImageData(0, 0, cAddition.width, cAddition.height);

                for (let y = 0; y < cAddition.height; y++) {
                    this.additionTable.push([])
                    for (let x = 0; x < cAddition.width; x++) {
                        let index = (y * cAddition.width + x) * 4;
                        let idt = imgData.data;
                        let value = (idt[index] + idt[index + 1] + idt[index + 2])
                        value /= 3;
                        value /= 255

                        // Add Noise
                        value += Math.random() * this.addNoise;

                        this.additionTable[y].push([value]);
                    }
                }

                resolve();
            })
            imgAddition.src = this.additionURL;
        })
    },

    fillAdditionTableSinPlane() {
        this.additionTable = [];

        // AdditionTables sollen grundsätzlich in einem Promise ausgeführt werden, damit man nicht immer umbauen muss, wenn Bilder benutzt werden
        return new Promise((resolve, reject) => {

            for (let y = 0; y < settings.cSize.y; y++) {
                this.additionTable.push([])
                for (let x = 0; x < settings.cSize.x; x++) {
                    let a = x / 180 * Math.PI;
                    let b = y / 180 * Math.PI;
                    a *= this.noiseZoom;
                    b *= this.noiseZoom;
                    let value = (Math.cos(a) + Math.sin(b)) / 2;
                    value = (value + 1) / 2;
                    value += Math.random() * this.addNoise;

                    this.additionTable[y][x] = value;
                }
            }
            resolve();
        })
    },

    fillAdditionTableJulia() {
        this.additionTable = [];
        // let realPart = -0.7, imagPart = 0.27015, maxIterations = 100;
        let realPart = rnd(-200, -10) / 100,
            imagPart = rnd(0, 100) / 100,
            maxIterations = 100,
            camX = rnd(-100, 100) / 100,
            camY = rnd(-100, 100) / 100,
            zoom = rnd(50, 500) / 100;

        // AdditionTables sollen grundsätzlich in einem Promise ausgeführt werden, damit man nicht immer umbauen muss, wenn Bilder benutzt werden
        return new Promise((resolve, reject) => {
            for (let y = 0; y < settings.cSize.y; y++) {
                this.additionTable.push([])
                for (let x = 0; x < settings.cSize.x; x++) {

                    let zx = 1.5 * (x - settings.cSize.x / 2) / (0.5 * settings.cSize.x) / zoom + camX;
                    let zy = (y - settings.cSize.y / 2) / (0.5 * settings.cSize.y) / zoom + camY;
                    let i;

                    for (i = maxIterations; zx * zx + zy * zy < 4 && i > 0; i--) {
                        const xtemp = zx * zx - zy * zy + realPart;
                        zy = 2 * zx * zy + imagPart;
                        zx = xtemp;
                    }
                    let value = (i === 0) ? 0 : 1 - i / maxIterations;
                    value **= 1 / 2
                    this.additionTable[y][x] = value;
                }
            }

            // Julia in einen Canvas zeichnen
            const cAddition = document.createElement('canvas');
            const ctx = cAddition.getContext('2d');
            cAddition.width = settings.cSize.x;
            cAddition.height = settings.cSize.y;

            cAddition.style.width = cAddition.width / 2 + 'px';
            cAddition.style.height = cAddition.height / 2 + 'px';

            document.body.append(cAddition);

            // AdditionTable füllen
            const imgData = ctx.getImageData(0, 0, cAddition.width, cAddition.height);

            for (let y = 0; y < cAddition.height; y++) {
                for (let x = 0; x < cAddition.width; x++) {
                    let index = (y * cAddition.width + x) * 4;
                    imgData.data[index] = ~~(this.additionTable[y][x] * 255)
                    imgData.data[index + 1] = ~~(this.additionTable[y][x] * 255)
                    imgData.data[index + 2] = ~~(this.additionTable[y][x] * 255)
                    imgData.data[index + 3] = 255
                }
            }
            ctx.putImageData(imgData, 0, 0);


            resolve();
        })
    },

    fillAdditionTableBalls() {
        this.additionTable = [];
        // let numBalls = 14;

        // AdditionTables sollen grundsätzlich in einem Promise ausgeführt werden, damit man nicht immer umbauen muss, wenn Bilder benutzt werden
        return new Promise((resolve, reject) => {

            const cAddition = document.createElement('canvas');
            const ctx = cAddition.getContext('2d');
            cAddition.className = 'preview';
            cAddition.width = settings.cSize.x;
            cAddition.height = settings.cSize.y;

            document.body.append(cAddition);
            console.log('FillAdditionTable');
            ctx.fillStyle = '#0f0';
            ctx.fillRect(0, 0, cAddition.width, cAddition.height);
            ctx.globalCompositeOperation = 'add';
            // Canvas füllen
            for (let i = 0; i < this.numBalls; i++) {
                let x = rnd(0, cAddition.width);
                let y = rnd(0, cAddition.height);
                let r = rnd(50, cAddition.height / 3);
                let myGradient = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, r
                );
                myGradient.addColorStop(0, 'hsl(0,100%,50%,1)')
                myGradient.addColorStop(1, 'hsl(0,100%,50%,0)')
                ctx.fillStyle = myGradient;
                ctx.beginPath()
                ctx.arc(x, y, r, 0, 2 * Math.PI)
                ctx.fill();
            }

            // AdditionTable füllen
            const imgData = ctx.getImageData(0, 0, cAddition.width, cAddition.height);

            for (let y = 0; y < cAddition.height; y++) {
                this.additionTable.push([])
                for (let x = 0; x < cAddition.width; x++) {
                    let index = (y * cAddition.width + x) * 4;
                    let idt = imgData.data;
                    let value = idt[index] / 255;

                    // Add Noise
                    value += Math.random() * this.addNoise;

                    this.additionTable[y].push([value]);
                }
            }

            resolve();
        })
    },

}

export default addition;