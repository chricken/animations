'use strict';

import settings, { elements } from '/modules/settings.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';
import Square from './classes/square.js';

class Field {
    constructor(right, bottom) {
        this.right = right;
        this.bottom = bottom;
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

    createMaze() {
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
    renderMaze() {
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

        // settings.perlin = new Perlin(settings.p);
        draw.createMaze();
        draw.renderMaze();

        // draw.step();
    }
}

export default draw;
export let render = draw.render;