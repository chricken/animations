'use strict';

import settings, { elements } from '../../../../modules/settings.js';
import helpers, { rnd, lead0 } from '../../../../modules/helpers.js';

class Px {
    constructor({ x, y, distance } = {}) {
        this.x = x;
        this.y = y;
        this.index = null;
        this.distance = distance;
        this.color = null;
    }
}

const tables = {
    // Array für die Pixel vorbereiten
    fillPxTable() {
        // 1-Dimensionales Array mit den Pixeln des Canvas
        // In diesem Array wird beim Rendern die Farbe eingetragen
        this.pxTable = [];

        // Zusätzliches 2D-Array, um die umgebungsfarben effizient lesen zu können
        this.pxTable2D = []

        for (let y = 0; y < settings.cSize.y; y++) {
            this.pxTable2D.push([])
            for (let x = 0; x < settings.cSize.x; x++) {

                // Den dichtesten Startpunkt finden
                const nearestStartSeed = this.startSeeds.reduce(
                    (nearest, seed) => {
                        // Abstand berechnen
                        let distance = helpers.pythagorasPoints({ x, y }, seed)

                        // Noise hinzufügen
                        distance += rnd(0, settings.addNoise * 100) / 100;

                        if (distance < nearest.distance && distance > 0) {
                            return {
                                x: seed.x,
                                y: seed.y,
                                distance
                            };
                        } else {
                            return nearest;
                        }
                    },
                    new Px({
                        x, y,
                        distance: Infinity
                    })
                )

                // Abstand vom aktuellen Punkt zum dichtesten Startseed ermitteln
                // console.log(x, y, nearestStartSeed);
                // let px = nearestStartSeed;
                let px = new Px({
                    x, y,
                    distance: helpers.pythagorasPoints({ x, y }, { x: nearestStartSeed.x, y: nearestStartSeed.y })
                })

                px.distance += rnd(0, settings.addNoise * 100) / 100;
                // console.log(px);
                // console.log(' ');
                // Auf die Distanz einen Wert zählen
                if (this.additionInvert) {
                    px.distance += (1 - this.additionTable[y][x]) * this.additionInflux;
                } else {
                    px.distance += this.additionTable[y][x] * this.additionInflux;
                }
                // console.log(x, y, px.distance, this.additionTable[y][x] * this.additionInflux);

                this.pxTable.push(px);
                this.pxTable2D[y].push(px);
            }
        }
    },

    sortPxTable() {
        // Alles Shufflen, damit die gleich weit entfernte zufällig hintereinander stehen
        for (let i = 0; i < this.pxTable.length; i++) {
            let zIndex = rnd(0, this.pxTable.length);
            [this.pxTable[i], this.pxTable[zIndex]] = [this.pxTable[zIndex], this.pxTable[i]];
        }

        // Nach Distanz sortieren
        this.pxTable.sort((a, b) => a.distance - b.distance);

        for (let i = 0; i < this.pxTable.length; i++) {
            if (this.pxTable[i]) {
                this.pxTable[i].index = i;
            } else {
                // console.log('index', i);
            }
        }

    },

    // Farbtabelle füllen
    fillColorTableImg() {

        this.colorTable = [];
        return new Promise((resolve, reject) => {

            const cColor = document.createElement('canvas');
            const ctx = cColor.getContext('2d');

            cColor.className = 'preview';
            cColor.width = settings.cSize.x
            cColor.height = settings.cSize.y

            // cColor.style.width = cColor.width / 2 + 'px';
            // cColor.style.height = cColor.height / 2 + 'px';

            elements.containerPreview.append(cColor);

            const imgColors = document.createElement('img');
            imgColors.addEventListener('load', () => {
                ctx.drawImage(imgColors, 0, 0, cColor.width, cColor.height);
                /*
                ctx.drawImage(
                    settings.colorFileContent,
                    0,
                    0,
                    cColor.width,
                    cColor.height
                );
                */

                let imgData = ctx.getImageData(0, 0, cColor.width, cColor.height);

                for (let y = 0; y < imgData.height; y++) {
                    // this.colorTable.push([])
                    for (let x = 0; x < imgData.width; x++) {
                        let index = (y * imgData.width + x) * 4;
                        let dt = imgData.data
                        this.colorTable.push([dt[index], dt[index + 1], dt[index + 2]])
                    }
                }

                resolve();

            })

            imgColors.addEventListener('error', reject)

            imgColors.src = this.colorsURL;
        })
    },

    fillColorTable() {
        let numAllColors = 256 ** 3;
        let numPx = settings.cSize.x * settings.cSize.y;
        let colorInkrement = numAllColors / numPx;

        this.colorTable = [];
        // Schleife, die für jeden Pixel eine Farbe in ein Array schreibt
        // Die Farben sind gleichmäßig über das 8bit-RGB-Farbsystem verteilt
        for (let i = 0; i < numAllColors; i += colorInkrement) {
            let color = Math.round(i).toString(16);
            color = helpers.leadingZero(color, 6);
            let r = color[0] + color[1];
            let g = color[2] + color[3];
            let b = color[4] + color[5];
            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
            this.colorTable.push([r, g, b]);
        }

        // Draw Colortable
        const cColor = document.createElement('canvas');
        const ctx = cColor.getContext('2d');

        cColor.className = 'preview';
        cColor.width = settings.cSize.x
        cColor.height = settings.cSize.y

        elements.containerPreview.append(cColor);

        let imgData = ctx.getImageData(0, 0, cColor.width, cColor.height);

        for (let y = 0; y < imgData.height; y++) {
            // this.colorTable.push([])
            for (let x = 0; x < imgData.width; x++) {
                let index = (y * imgData.width + x) * 4;
                // console.log(index, this.colorTable[index / 4]);
                imgData.data[index] = this.colorTable[index / 4][0];
                imgData.data[index + 1] = this.colorTable[index / 4][1];
                imgData.data[index + 2] = this.colorTable[index / 4][2];
                imgData.data[index + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);

    },

    sortColorTable() {
        for (let i = 0; i < this.colorTable.length; i++) {
            let zIndex = rnd(0, this.colorTable.length - 1);
            [this.colorTable[i], this.colorTable[zIndex]] = [this.colorTable[zIndex], this.colorTable[i]];
        }
    },

}

export default tables;