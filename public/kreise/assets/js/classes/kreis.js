import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';

class Kreis {
    constructor(start, sp1a, sp2a, end, sp1b, sp2b, hue) {
        Object.assign(this, { start, sp1a, sp2a, end, sp1b, sp2b, hue })
        // this.rgb = helpers.HSLToRGB(hue, 100, 50);
        this.lineWidth = .4;
    }

    update() {
        // console.log(this.start);
        this.render();
    }

    render() {
        let c = elements.c;
        let ctx = c.getContext('2d');

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `hsl(${this.hue},100%,50%)`;

        let start = helpers.angleToXY([c.width / 6, c.height / 2], ...this.start);
        let sp1a = helpers.angleToXY([c.width / 5, 0], ...this.sp1a);
        let sp2a = helpers.angleToXY([c.width / 4 * 3, 0], ...this.sp2a);
        let end = helpers.angleToXY([c.width / 6 * 5, c.height / 2], ...this.end);

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