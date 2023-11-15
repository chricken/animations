import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';

class Kreis {
    constructor(start, sp1a, sp2a, end, hue) {

        let c = elements.c;
        let ctx = c.getContext('2d');

        Object.assign(this, { start, sp1a, sp2a, end, hue })


        // this.rgb = helpers.HSLToRGB(hue, 100, 50);
        this.lineWidth = 4;
    }

    update() {
        // console.log(this.start);
        this.render();
    }

    render() {
        let c = elements.c;
        let ctx = c.getContext('2d');

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `hsla(${this.hue},100%,50%,.1)`;
        // ctx.strokeStyle = `hsl(${this.hue},100%,50%)`;

        // Anhand von Abstand und Winkel den wirklichen Punkt berechnen
        let start = helpers.angleToXY(...this.start);
        let sp1a = helpers.angleToXY(...this.sp1a);
        let sp2a = helpers.angleToXY(...this.sp2a);
        let end = helpers.angleToXY(...this.end);

        /* Punkte zeichnen
        ctx.fillStyle = '#fff';
        ctx.fillRect(...start, 2, 2);
        ctx.fillRect(...sp1a, 2, 2);
        ctx.fillRect(...sp2a, 2, 2);
        ctx.fillRect(...end, 2, 2);

        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.start[2], this.start[3], 2, 2);
        ctx.fillRect(this.sp1a[2], this.sp1a[3], 2, 2);
        ctx.fillRect(this.sp2a[2], this.sp2a[3], 2, 2);
        ctx.fillRect(this.end[2], this.end[3], 2, 2);
        */

        ctx.beginPath();

        // Start
        ctx.moveTo(...start);

        // SP 1a, SP 2a, end
        ctx.bezierCurveTo(
            ...sp1a,
            ...sp2a,
            ...end,
        )

        // SP 1b, SP 2b, start
        ctx.bezierCurveTo(
            end[0] + (end[0] - sp2a[0]), end[1] + (end[1] - sp2a[1]),
            start[0] + (start[0] - sp1a[0]), start[1] + (start[1] - sp1a[1]),
            ...start
        )

        ctx.stroke()
    }
}

export default Kreis;