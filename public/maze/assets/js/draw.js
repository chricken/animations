'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';

class FieldMST {
    constructor(right, bottom) {
        this.right = right;
        this.bottom = bottom;
    }
}
class FieldDFS {
    constructor() {
        this.visited = false;
        this.top = false;
        this.right = false;
        this.bottom = false;
        this.left = false;
    }
}

const draw = {
    step() {
        let c = elements.c;
        let ctx = elements.ctx;

        // Ein Bild rendern
        settings.counter++;
        let width = c.width / settings.numHorz;

        let imgData = elements.ctx.getImageData(0, 0, c.width, c.height);

        // Dieses Array wird mit den neuen zu füllenden Pixeln gefüllt und ersetzt nachher das alter Array mit zu füllenden Pixeln
        const newFillPx = [];

        // Über die aktuellen zu füllenden Pixel iterieren und füllen sowie die neuen zu füllenden Pixel finden
        for (let i = 0; i < settings.fillPx.length; i++) {
            let x = settings.fillPx[i][0];
            x *= width;
            x += width / 2;

            let y = settings.fillPx[i][1];
            y *= width;
            y += width / 2;

            console.log(x, y);

            // Index des neu zu füllenden Pixels
            let index = (x + (y * c.width)) * 4;
            imgData.data[index] = 255;
            imgData.data[index + 1] = 255;
            imgData.data[index + 2] = 255;
            imgData.data[index + 3] = 255;

            // Benachbarte ungefüllte Pixel finden
            // Oben
            if (y > 0) {
                let index = (x + (y - 1 * c.width)) * 4;
                // Statt eines if-Statement
                // Alfa-Kanal nutzen um zu sehen, ob das Feld schon gefüllt ist
                ((imgData[index + 3]) < 1) || newFillPx.push([x, y - 1]);
            }

            // Unten
            if (y < c.height - 1) {
                let index = (x + (y + 1 * c.width)) * 4;
                ((imgData[index + 3]) < 1) || newFillPx.push([x, y + 1]);
            }

            // Links
            if (x > 0) {
                let index = ((x - 1) + (y * c.width)) * 4;
                ((imgData[index + 3]) < 1) || newFillPx.push([x - 1, y]);
            }

            // Rechts
            if (x < c.width - 2) {
                let index = ((x + 1) + (y * c.width)) * 4;
                ((imgData[index + 3]) < 1) || newFillPx.push([x + 1, y]);
            }

        }
        console.log(newFillPx);

        ctx.putImageData(imgData, 0, 0);

        // Noise neu füllen
        // draw.drawNoise();

        // Noise verschieben
        // settings.posZ += settings.deltaZ;



        // draw.animate();
    },

    animate() {
        // Speichern und rendervorgang erneuern
        settings.fileNo++;
        if (settings.saveFile) {
            if (settings.fileNo < settings.maxFiles) {
                ajax.saveCanvasToServer(elements.c, `image_${lead0(settings.fileNo, 6)}.png`).then(
                    () => {
                        requestAnimationFrame(draw.step)
                    }
                ).catch(
                    console.warn
                )
            }
        } else {
            requestAnimationFrame(draw.step)
        }
    },

    checkPossibleNextFields(x, y) {
        // Intermediate
        let maze = settings.maze;

        let possibleNextFields = [];

        if (maze[x - 1] && !maze[x - 1][y].visited) possibleNextFields.push({
            direction: 'left',
            vertex: [x - 1, y]
        });

        if (maze[x + 1] && !maze[x + 1][y].visited) possibleNextFields.push({
            direction: 'right',
            vertex: [x + 1, y]
        });

        if (maze[x][y - 1] && !maze[x][y - 1].visited) possibleNextFields.push({
            direction: 'top',
            vertex: [x, y - 1]
        });

        if (maze[x][y + 1] && !maze[x][y + 1].visited) possibleNextFields.push({
            direction: 'bottom',
            vertex: [x, y + 1]
        });

        return possibleNextFields;
    },

    // Wände durchbrechen
    touchField(x, y) {
        // console.log(x, y);

        // Intermediate
        let maze = settings.maze;

        maze[x][y].visited = true;


        // Mögliche nächste Felder suchen
        let possibleNextFields = draw.checkPossibleNextFields(x, y);

        if (possibleNextFields.length > 1) {
            settings.possibleBranches.push([x, y]);
        }

        if (possibleNextFields.length) {
            // console.log(possibleNextFields);
            let indexNext = rnd(0, possibleNextFields.length - 1);
            let next = possibleNextFields[indexNext];

            // Die Wand, durch die ich gehe, entfernen
            let field = maze[x][y];
            field[next.direction] = true;

            // Die Wand, von der ich komme, entfernen
            let nextField = maze[next.vertex[0]][next.vertex[1]];
            switch (next.direction) {
                case 'top':
                    nextField.bottom = true;
                    break;
                case 'right':
                    nextField.left = true;
                    break;
                case 'bottom':
                    nextField.top = true;
                    break;
                case 'left':
                    nextField.right = true;
                    break;
                default:
                    break;
            }

            // console.log(indexNext);
            // console.log(possibleNextFields[indexNext]);
            draw.touchField(...next.vertex);
        } else {
            // console.log(settings.possibleBranches);
            // Ziel bestimmen
            draw.startNextBranch();
            settings.endVertex = [x, y];
            // console.log(settings.endVertex);
        }
    },

    startNextBranch() {
        // Alle Wege nachträglich auf mögliche Pfade prüfen
        settings.possibleBranches = settings.possibleBranches.filter(branch => {
            return draw.checkPossibleNextFields(...branch).length > 0;
        })
        let start = settings.possibleBranches[rnd(0, settings.possibleBranches.length - 1)];
        if (start) {
            draw.touchField(...start);
        }
        // console.log('Start', start);
    },

    createMazeDFS() {

        settings.startVertex = [
            rnd(0, settings.numHorz - 1),
            rnd(0, settings.numVert - 1),
        ]
        settings.endVertex = []

        // Felder für das Labyrinth
        for (let x = 0; x < settings.numHorz; x++) {
            settings.maze.push([]);
            for (let y = 0; y < settings.numVert; y++) {
                settings.maze[x].push(new FieldDFS());
            }
        }

        draw.touchField(...settings.startVertex);

    },

    renderMazeDFS() {
        let c = elements.c;
        let ctx = elements.ctx;

        let width = c.width / settings.numHorz;
        let border = width / 5;

        for (let x = 0; x < settings.numHorz; x++) {
            for (let y = 0; y < settings.numVert; y++) {
                let field = settings.maze[x][y];
                ctx.fillStyle = '#0f0';

                ctx.beginPath();
                // Oben
                if (!field.top) {
                    ctx.roundRect(
                        x * width - (border / 2),
                        y * width - (border / 2),
                        width + border,
                        border,
                        border / 2
                    )
                }

                // Rechts
                if (!field.right) {
                    ctx.roundRect(
                        (x + 1) * width - (border / 2),
                        y * width - (border / 2),
                        border,
                        width + border,
                        border / 2
                    )
                }

                // unten
                if (!field.bottom) {
                    ctx.roundRect(
                        x * width - (border / 2),
                        (y + 1) * width - (border / 2),
                        width + border,
                        border,
                        border / 2
                    )
                }

                // Links
                if (!field.left) {
                    ctx.roundRect(
                        x * width - (border / 2),
                        y * width - (border / 2),
                        border,
                        width + border,
                        border / 2
                    )
                }
                ctx.fill()

            }
        }

        // Startpunkt

        ctx.fillStyle = '#220';
        ctx.beginPath();
        ctx.arc(
            (settings.startVertex[0] + .5) * width,
            (settings.startVertex[1] + .5) * width,
            width / 2.5,
            0, 2 * Math.PI
        )
        ctx.fill();


        // Endpunkt
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(
            (settings.endVertex[0] + .5) * width,
            (settings.endVertex[1] + .5) * width,
            width / 2.5,
            0, 2 * Math.PI
        )
        ctx.fill();
    },

    drawNoise() {

        let c = elements.c;
        let ctx = elements.ctx;

        /*
        let img = ctx.getImageData(0, 0, c.width, c.height);

        // Flowmap füllen
        for (let i = 0; i < img.data.length; i += 4) {
            // Flowmap im Canvas darstellen
            img.data[i] = ~~(value * 255);
            img.data[i + 1] = ~~(value * 255);
            img.data[i + 2] = ~~(value * 255);
            img.data[i + 3] = 255;
        }

        // console.log(settings.noise);

        ctx.putImageData(img, 0, 0);
        */
    },

    init() {
        // Wird initial einmal aufgerufen
        settings.counter = 0;
        settings.numVert = ~~(settings.numHorz / elements.c.width * elements.c.height);
        settings.maze = [];
        settings.possibleBranches = [];

        // settings.perlin = new Perlin(settings.p);
        draw.createMazeDFS();
        draw.renderMazeDFS();
        console.log(settings.startVertex);
        settings.fillPx.push(settings.startVertex);
        draw.step()

    }
}

export default draw;
export let render = draw.render;