'use strict';

import settings, { elements } from '../../../../modules/settings.js';
import helpers, { rnd, lead0 } from '../../../../modules/helpers.js';
import ajax from '../../../../modules/ajax.js';
import noises, { Perlin } from '../../../../modules/noises.js';

let fileNo = 0;

class Px {
    constructor(x, y, distance) {
        this.x = x;
        this.y = y;
        this.status = 'unset';
        this.index = null;
        this.distance = distance;
        this.color = null;
    }
}

class RainbowSmoke {
    constructor() {
        this.pxTableindex = 0;

        // Einfluss des Additiontables auf die Farbverteilung
        this.additionInflux = 70;

        // Multiplier, um beim Rendern die Noise anzuzeigen
        this.showNoiseMult = 100

        // Zoom für Addition Noise
        this.zoom = 60;

        // Divider, der das Finden ähnlich-farbiger Pixel beschleunigt 
        // auf Kosten der Qualität
        // Niedrigere Zahl = schneller/Schlechter
        this.dividerSimilarity = 15000;


        console.time();

        // this.thresholdSimilarity = 20;

        // StartPixel auf einen zufälligen Wert setzen
        this.startPixel = {
            x: rnd(0, settings.cSize.x),
            y: rnd(0, settings.cSize.y),
        }

        console.log(this.startPixel.x, this.startPixel.y);

        this.fillAdditionTablePerlin()

        this.fillPxTable();

        this.sortPxTable();

        this.fillColorTable();

        this.sortColorTable();

        this.pxTable2D[this.startPixel.y][this.startPixel.x].color = [
            rnd(0, 255),
            rnd(0, 255),
            rnd(0, 255),
        ];

        // console.log('startColor', this.pxTable2D[this.startPixel.y][this.startPixel.x]);

        // Nächsten 
        this.iterate(500);
        // this.update();
        // this.render()

    }

    // Den nächsten Pixel finden und füllen
    update() {
        // console.time()
        let nextPx = this.findNextPixel();
        let envColor = this.findEnvColor(nextPx);
        // console.log('envColor', envColor);
        let nextColor = this.findNearestColor(envColor);
        // console.log('nextColor', nextColor);
        nextPx.color = nextColor.color.color;
        // console.log('nextPx', nextPx);
        // console.timeEnd()
    }

    // Ein Table mit zusätzlichen Werten, die auf die Distance gerechnet und 
    // damit den Aufbau etwas interessanter gestalten sollen
    fillAdditionTableSinus() {
        this.additionTable = [];

        for (let y = 0; y < settings.cSize.y; y++) {
            this.additionTable.push([]);
            for (let x = 0; x < settings.cSize.x; x++) {
                // Das Array soll mit Zahlen zwischen 0 und 1 gefüllt sein
                this.additionTable[y].push((Math.sin(x * 180 / Math.PI) + 1) / 2);
            }
        }
    }
    fillAdditionTablePerlin() {
        this.additionTable = [];

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
                let [x1, y1, z1] = [x / this.zoom, y / this.zoom, 0];
                let [x2, y2, z2] = [x / this.zoom * 4, y / this.zoom * 4, 100];
                let val1 = (perlin.noise(x1, y1, z1) + 1) / 2;
                let val2 = (perlin.noise(x2, y2, z2) + 1) / 2;
                let val = (val1 *2 + val2) / 3;
                // Das Array soll mit Zahlen zwischen 0 und 1 gefüllt sein
                this.additionTable[y].push(val);
            }
        }
    }

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
                let px = {
                    x,
                    y,
                    index: null,
                    distance: helpers.pythagorasPoints({ x, y }, this.startPixel),
                    color: null
                }
                // Auf die Distanz einen Wert zählen
                px.distance += this.additionTable[y][x] * this.additionInflux;
                // console.log(x, y, px.distance, this.additionTable[y][x] * this.additionInflux);

                this.pxTable.push(px);
                this.pxTable2D[y].push(px);
            }
        }
    }

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

        // console.log(this.pxTable);
    }

    // Farbtabelle füllen
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
        // console.log(this.colorTable);

    }

    sortColorTable() {
        for (let i = 0; i < this.colorTable.length; i++) {
            let zIndex = rnd(0, this.colorTable.length - 1);
            [this.colorTable[i], this.colorTable[zIndex]] = [this.colorTable[zIndex], this.colorTable[i]];
        }
    }

    // Aus dem Colortable die ähnlichste Farbe finden und diese aus dem Colortable entfernen
    findNearestColor(color = [0, 0, 0]) {
        let nearestColors = {
            distance: Infinity,
            colors: []
        }

        // console.log(this.colorTable);
        for (let i = 0; i < this.colorTable.length; i += 3) {
            let tableColor = this.colorTable[i];
            let distance = this.calcDistance(color, tableColor);

            if (distance == nearestColors.distance) {
                // Wenn diese Farbe so gleich ist wie die aktuell gleichste Farbe, dann hänge diese Farbe in das Array
                nearestColors.colors.push({
                    index: i,
                    color: tableColor
                })
            } else if (distance < nearestColors.distance) {
                // Wenn diese Farbe gleicher ist als die bisher gleichste, ersetze jene durch diese
                nearestColors = {
                    distance,
                    colors: [{
                        index: i,
                        color: tableColor
                    }]
                }
            }

            // Wenn eine Schwellengenauigkeit erreicht ist, brich die Schleife ab
            // console.log(distance, this.thresholdSimilarity, i,this.colorTable.length );
            // Dies soll nur getMaxListeners, wenn noch genügend Farben zur Verfügung stehen
            /*if (
                distance <= this.thresholdSimilarity &&
                this.colorTable.length > this.thresholdSimilarity * 10
            ) {
                break;
            }*/
            // bessere Variante 
            if (distance < this.colorTable.length / this.dividerSimilarity) {
                break
            }
        }

        // Aus den Farben eine zufällige Farbe wählen
        let col = nearestColors.colors;
        // console.log(nearestColors);
        // console.log(col);
        let index = helpers.createNumber(0, col.length - 1);
        col = {
            distance: nearestColors.distance,
            color: col[index]
        };
        this.colorTable.splice(col.color.index, 1);

        return col;

    }

    // nächsten zu rendernden Pixel finden
    findNextPixel() {
        this.pxTableindex++;
        let nearestPx = this.pxTable[this.pxTableindex];
        return nearestPx;
    }

    // Übertragen des pxTables in das Canvas
    render() {
        let imgData = elements.ctx.getImageData(0, 0, settings.cSize.x, settings.cSize.y);
        for (let y = 0; y < this.pxTable2D.length; y++) {
            for (let x = 0; x < this.pxTable2D[y].length; x++) {
                if (this.pxTable2D[y][x].color) {
                    // console.log(this.pxTable2D[y][x]);
                    // Aus den Imagedaten den richtigen Pixel nehmen und färben
                    imgData.data[((y * settings.cSize.x) + x) * 4] = this.pxTable2D[y][x].color[0];
                    imgData.data[((y * settings.cSize.x) + x) * 4 + 1] = this.pxTable2D[y][x].color[1];
                    imgData.data[((y * settings.cSize.x) + x) * 4 + 2] = this.pxTable2D[y][x].color[2];
                    imgData.data[((y * settings.cSize.x) + x) * 4 + 3] = 255;
                } else {
                    let value = (this.additionTable[y][x] * this.showNoiseMult);
                    imgData.data[((y * settings.cSize.x) + x) * 4] = value;
                    imgData.data[((y * settings.cSize.x) + x) * 4 + 1] = value;
                    imgData.data[((y * settings.cSize.x) + x) * 4 + 2] = value;
                    imgData.data[((y * settings.cSize.x) + x) * 4 + 3] = 255;
                }
            }
        }
        elements.ctx.putImageData(imgData, 0, 0);
    }

    iterate(numIterations = 100) {
        for (let i = 0; i < numIterations; i++) {
            this.update()
        }
        this.render();

        // Animation
        if (settings.saveFile) {
            ajax.saveCanvasToServer(elements.c, `image_${lead0(fileNo, 6)}.png`).then(
                () => {
                    fileNo++;
                    // this.animate()
                    if (this.colorTable.length > numIterations + 1) {
                        requestAnimationFrame(() => this.iterate(numIterations));
                    } else {

                        console.timeEnd()
                    }
                }
            ).catch(
                console.warn
            )
        } else {
            if (this.colorTable.length > numIterations) {
                requestAnimationFrame(() => this.iterate(numIterations));
            } else {
                if(this.colorTable.length>1){
                    requestAnimationFrame(() => this.iterate(~~(numIterations/2)));
                }
                console.timeEnd()
            }
        }
    }

    // Die umgebenden Pixel nach der Farbe analysieren und den Durchschnittt bilden
    findEnvColor({ x, y }) {
        // console.log(x, y);
        let color = [0, 0, 0];
        let numFoundPx = 0;

        // Neun Pixel in der Umgebung abscannen
        // Alle Farbwerte aufeinander addieren
        for (let dY = -1; dY <= 1; dY++) {
            for (let dX = -1; dX <= 1; dX++) {
                // Checken, ob der Pixel innerhalb der Pixeldaten 
                if (
                    x + dX >= 0 &&
                    x + dX < settings.cSize.x &&
                    y + dY >= 0 &&
                    y + dY < settings.cSize.y
                ) {
                    // console.log(y + dY, x + dX);
                    let px = this.pxTable2D[y + dY][x + dX];
                    // console.log(dX, dY);
                    // console.log(px);
                    if (px.color != null) {
                        color[0] += px.color[0];
                        color[1] += px.color[1];
                        color[2] += px.color[2];
                        numFoundPx++;
                    }
                }
            }
        }
        color = color.map(ch => ~~(ch / numFoundPx));
        return color;

    }

    // Errechnen des Unterschiedes von einer Farbe zur anderen
    calcDistance(color1, color2) {
        let distance = [
            Math.abs(color1[0] - color2[0]),
            Math.abs(color1[1] - color2[1]),
            Math.abs(color1[2] - color2[2]),
        ];
        distance = distance[0] + distance[1] + distance[2];
        return distance;
    }
}

export default RainbowSmoke;