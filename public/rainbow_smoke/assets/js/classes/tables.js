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
        console.log('fillPxTable');
        // 1-Dimensionales Array mit den Pixeln des Canvas
        // In diesem Array wird beim Rendern die Farbe eingetragen
        this.pxTable = [];

        // Zusätzliches 2D-Array, um die umgebungsfarben effizient lesen zu können
        this.pxTable2D = []

        for (let y = 0; y < settings.cSize.y; y++) {
            this.pxTable2D.push([])
            for (let x = 0; x < settings.cSize.x; x++) {
                let px = new Px({
                    x, y,
                    distance: helpers.pythagorasPoints({ x, y }, this.startPixel)
                })
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
        console.log('sortPxTable');
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
    fillColorTable() {
        console.log('fillColorTable');
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
        // console.log(this.colorTable);

    },

    sortColorTable() {
        console.log('sortColorTable');
        for (let i = 0; i < this.colorTable.length; i++) {
            let zIndex = rnd(0, this.colorTable.length - 1);
            [this.colorTable[i], this.colorTable[zIndex]] = [this.colorTable[zIndex], this.colorTable[i]];
        }
    }

}

export default tables;