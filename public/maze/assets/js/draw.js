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
        // Ein Bild rendern
        settings.counter++;

        // Noise neu füllen
        // draw.drawNoise();

        // Noise verschieben
        // settings.posZ += settings.deltaZ;

        elements.ctx.fillStyle = 'hsla(0,0%,100%,.01)';
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);
        // elements.ctx.fillRect(0, 0, elements.c.width, elements.c.height);

        settings.points.forEach(point => point.update());

        draw.animate();
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

    // Wände durchbrechen
    touchField(x, y) {
        // console.log(x, y);

        // Intermediate
        let maze = settings.maze;

        maze[x][y].visited = true;

        // Mögliche nächste Felder suchen
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
            // Ziel bestimmen

            settings.endVertex = [x, y];
        }
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

        console.log(settings.possibleBranches);
    },

    renderMazeDFS() {
        let c = elements.c;
        let ctx = elements.ctx;

        let width = c.width / settings.numHorz;

        for (let x = 0; x < settings.numHorz; x++) {
            for (let y = 0; y < settings.numVert; y++) {
                let field = settings.maze[x][y];
                ctx.fillStyle = '#0f0';

                ctx.beginPath();
                // Oben
                if (!field.top) {
                    ctx.roundRect(
                        x * width,
                        y * width,
                        width,
                        width / 10,
                        2
                    )
                }

                // Rechts
                if (!field.right) {
                    ctx.roundRect(
                        (x + 1) * width,
                        y * width,
                        -width / 10,
                        width,
                        2
                    )
                }

                // unten
                if (!field.bottom) {
                    ctx.roundRect(
                        x * width,
                        (y + 1) * width,
                        width,
                        -width / 10,
                        2
                    )
                }

                // Links
                if (!field.left) {
                    ctx.roundRect(
                        x * width,
                        y * width,
                        width / 10,
                        width,
                        2
                    )
                }
                ctx.fill()

            }
        }

        // Startpunkt
        ctx.fillStyle = '#ff0';
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

    createMazeMST() {
        settings.widthPath = ~~(elements.c.width / settings.numHorz);

        // Weights, die an die Wände verteilt werden.
        // Braucht doppelt so viele Weights wie Felder, da jedes Feld zwei Ausgänge (benötigen je eine weight) hat
        let weights = [...new Array(settings.numHorz * settings.numVert * 2)].map((val, index) => index);
        // console.log(weights.toString());

        // Minimum Spanning Tree nach: https://www.baeldung.com/cs/maze-generation
        // Array mit allen Feldern des Labyrints.
        // In dem Array werden Objekte gespeichert mit den Zufallswerten für die rechte und die untere Wand. Dadurch ergeben sich amme Wände.
        // Die letzen Felder werden werden nicht ausgeführt.
        for (let i = 0; i < (settings.numHorz * settings.numVert); i++) {
            let field = new Field(
                weights.splice(rnd(0, weights.length - 1), 1)[0],
                weights.splice(rnd(0, weights.length - 1), 1)[0],
            )
            settings.maze.push(field);
        }
        console.log(settings.maze);
    },
    renderMazeMST() {
        let c = elements.c;
        let ctx = elements.ctx;

        // ctx.beginPath();
        ctx.fillStyle = '#fff';
        for (let y = 0; y < settings.numVert; y++) {
            for (let x = 0; x < settings.numHorz; x++) {
                console.log(x * settings.widthPath, y * settings.widthPath);
                ctx.font = '10px arial'
                ctx.fillText(
                    settings.maze[x + (y * settings.numHorz)].right,
                    (x + 1) * settings.widthPath,
                    (y + 1) * settings.widthPath - (settings.widthPath / 2),
                );
                ctx.fillText(
                    settings.maze[x + (y * settings.numHorz)].bottom,
                    (x + 1) * settings.widthPath - (settings.widthPath / 2),
                    (y + 1) * settings.widthPath,
                );
            }
        }

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

        // draw.step();
    }
}

export default draw;
export let render = draw.render;