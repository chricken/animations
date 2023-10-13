'use strict';

import settings, { elements } from '../../../../modules/settings.js';
import helpers, { rnd, lead0 } from '../../../../modules/helpers.js';
import ajax from '../../../../modules/ajax.js';
import addition from './addition.js';
import tables from './tables.js';

let fileNo = 0;

class RainbowSmoke {
    pxTableindex = 0;

    constructor({
        additionInflux = 10,
        additionInvert = true,
        showNoiseMult = 100,
        noiseZoom = 60,
        dividerSimilarity = 1000,
        additionFilename = 'Apophysis-2.png',
        numIterationsPerUpdate = 300,
        startPixel = {
            x: rnd(0, settings.cSize.x),
            y: rnd(0, settings.cSize.y),
        },
        additionToUse = 'fillAdditionTableImg',
        addNoise=0,
    } = {}) {

        // Einfluss des Additiontables auf die Farbverteilung
        this.additionInflux = additionInflux;

        // Ob die Addition umgekehrt interpretiert werden soll
        // true: hellere Bereiche werden früher gefüllt.
        this.additionInvert = additionInvert;

        // Multiplier, um beim Rendern die Noise anzuzeigen
        this.showNoiseMult = showNoiseMult;

        // Zoom für Addition Noise
        this.noiseZoom = noiseZoom;

        // Zusätzliches Rauschen für die Addition
        this.addNoise = addNoise;

        // Divider, der das Finden ähnlich-farbiger Pixel beschleunigt 
        // auf Kosten der Qualität
        // Niedrigere Zahl = schneller/Schlechter
        this.dividerSimilarity = dividerSimilarity;

        // URL zum zu ladenden Bild für die Addition
        this.additionURL = './assets/img/' + additionFilename;

        // Anzahl der Updates, die je Iteration gemacht werden sollen
        // const numIterationsPerUpdate = numIterationsPerUpdate;

        // Addition-Methoden eintragen
        Object.entries(addition).forEach(([key, value]) => {
            // console.log(key, value);
            this[key] = value.bind(this);
        })

        Object.entries(tables).forEach(([key, value]) => {
            // console.log(key, value);
            this[key] = value.bind(this);
        })

        // StartPixel auf einen zufälligen Wert setzen
        this.startPixel = startPixel;

        console.log(this.startPixel.x, this.startPixel.y);

        this[additionToUse]().then(
            () => {
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
                console.log('Start Update and Render');
                // Nächste Runde
                this.iterate(numIterationsPerUpdate)
                // this.update();
                // this.render()
            }
        )
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
        // console.log('iterate', numIterations);
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
                if (this.colorTable.length > 1) {
                    requestAnimationFrame(() => this.iterate(~~(numIterations / 2)));
                }
                // console.timeEnd()
            }
        }
    }

    // Die umgebenden Pixel nach der Farbe analysieren und den Durchschnittt bilden
    findEnvColor({ x, y } = {}) {
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