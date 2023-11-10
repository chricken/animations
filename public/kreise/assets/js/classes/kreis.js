import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';

class Kreis {
    constructor(start, sp1a, sp2a, end, sp1b, sp2b, hue) {
        Object.assign(this, { start, sp1a, sp2a, end, sp1b, sp2b,hue })
        // this.rgb = helpers.HSLToRGB(hue, 100, 50);
        this.lineWidth = .2;
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

        ctx.beginPath();

        ctx.moveTo(...this.start);

        ctx.bezierCurveTo(
            ...this.sp1a,
            ...this.sp2a,
            ...this.end
        )

        ctx.bezierCurveTo(
            ...this.sp1b,
            ...this.sp2b,
            ...this.start
        )

        ctx.stroke()
    }
}

export default Kreis;