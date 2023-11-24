'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';

const draw = {
    step() {
        // Ein Bild rendern
        settings.counter++;
        elements.ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        draw.fractal();

        if (settings.animate) draw.animate();
    },

    fractal() {
        const c = elements.c;
        const ctx = elements.ctx;

        ctx.save();

        ctx.translate(
            c.width * settings.startPos[0],
            c.height * settings.startPos[1]
        );

        for (let i = 0; i < settings.numRoots; i++) {
            ctx.save()
            ctx.rotate((Math.PI * 2) / settings.numRoots * i);
            ctx.translate(...settings.rootDistance);

            draw.branch(0);
            ctx.restore()
        }
        ctx.restore()
    },

    branch(level) {
        const c = elements.c;
        const ctx = elements.ctx;
        if (level > settings.maxLevel) return;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round'
        ctx.shadowColor = 'rgba(0,0,0,.7)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 2;
        // ctx.globalCompositeOperation = 'overlay'

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(settings.size, 0);
        ctx.stroke();

        for (let i = 0; i <= settings.numBranches; i++) {
            let scale = settings.scale * (1 + i / 5)
            // Linke Branches
            ctx.save()
            // ctx.translate(settings.size * settings.posBranch, 0);
            let offset = settings.offsetBranch * settings.size;
            let size = settings.size - offset;
            ctx.translate(settings.size - (size / settings.numBranches * i), 0);
            let rndRot = rnd(-settings.randomRotation * 100, settings.randomRotation * 100) / 100
            ctx.rotate(settings.rotation * (1 + i / 2) - rndRot);
            
            
            ctx.scale(scale, scale);
            draw.branch(level + 1);
            ctx.restore()
            
            // Rechte Branches
            ctx.save()
            ctx.translate(settings.size - (size / settings.numBranches * i), 0);
            rndRot = rnd(-settings.randomRotation * 100, settings.randomRotation * 100) / 100
            ctx.rotate(-settings.rotation * (1 + i / 2) - rndRot);

            ctx.scale(scale, scale);
            draw.branch(level + 1);
            ctx.restore();
        }
    },

    animate() {
        // Speichern und rendervorgang erneuern
        settings.fileNo++;
        console.clear();
        console.log(settings.fileNo);
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
    init() {
        // Wird initial einmal aufgerufen
        settings.counter = 0;

        draw.step();
    }
}

export default draw;
export let render = draw.render;