import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import Kreis from './kreis.js';

class Kreise {
    constructor() {
        let c = elements.c;
        let ctx = c.getContext('2d');

        // Punktedaten vorbereiten
        let speed = 80;
        this.maxNumberKreise = 500;
        this.hue = 0;
        this.sat = 70;
        this.deltaHue = 2;
        this.deltaSat = 2;

        this.delta1a = [rnd(-speed, speed) / 100, rnd(-speed, speed) / 100];
        this.delta2a = [rnd(-speed, speed) / 100, rnd(-speed, speed) / 100];

        this.delta1b = [rnd(-speed, speed) / 100, rnd(-speed, speed) / 100];
        this.delta2b = [rnd(-speed, speed) / 100, rnd(-speed, speed) / 100];

        this.deltaStart = [rnd(-speed, speed) / 100, rnd(-speed, speed) / 100];
        this.deltaEnd = [rnd(-speed, speed) / 100, rnd(-speed, speed) / 100];

        this.start = [c.width / 6, c.height / 2];
        this.sp1a = [c.width / 5, c.height / 6];
        this.sp2a = [c.width / 4 * 4, c.height / 6];
        this.end = [c.width / 4 * 3, c.height / 3];

        this.sp1b = [
            this.end[0] + (this.end[0] - this.sp2a[0]),
            this.end[1] + (this.end[1] - this.sp2a[1]),
        ]
        this.sp2b = [
            this.start[0] + (this.start[0] - this.sp1a[0]),
            this.start[1] + (this.start[1] - this.sp1a[1]),
        ]

        this.collection = [];
        this.update();
    }

    update() {

        let c = elements.c;
        let ctx = c.getContext('2d');

        // Ort-Daten aktualisieren
        this.start = this.start.map((value, index) => value + this.deltaStart[index]);
        this.sp1a = this.sp1a.map((value, index) => value + this.delta1a[index]);
        this.sp2a = this.sp2a.map((value, index) => value + this.delta2a[index]);
        this.end = this.end.map((value, index) => value + this.deltaEnd[index]);

        this.sp1b = [
            this.end[0] + (this.end[0] - this.sp2a[0]),
            this.end[1] + (this.end[1] - this.sp2a[1]),
        ]
        this.sp2b = [
            this.start[0] + (this.start[0] - this.sp1a[0]),
            this.start[1] + (this.start[1] - this.sp1a[1]),
        ]

        // Abprallen am Rand
        if (this.start[0] < 0 || this.start[0] > c.width) this.deltaStart[0] *= -1;
        if (this.start[1] < 0 || this.start[1] > c.height) this.deltaStart[1] *= -1;

        if (this.end[0] < 0 || this.end[0] > c.width) this.deltaEnd[0] *= -1;
        if (this.end[1] < 0 || this.end[1] > c.height) this.deltaEnd[1] *= -1;

        if (this.sp1a[0] < 0 || this.sp1a[0] > c.width) this.delta1a[0] *= -1;
        if (this.sp2a[1] < 0 || this.sp2a[1] > c.height) this.delta2a[1] *= -1;


        // Farbe verändern
        this.hue += rnd(-this.deltaHue * 100, this.deltaHue * 100) / 100;

        // Neuen Kreis einhängen
        this.collection.push(new Kreis(
            this.start,
            this.sp1a,
            this.sp2a,
            this.end,
            this.sp1b,
            this.sp2b,
            this.hue,
        ))
        // console.log(this.collection.length, this.maxNumberKreise);

        if (this.collection.length > this.maxNumberKreise) {
            this.collection.splice(0, 1);
        }

        this.collection.forEach(kreis => kreis.update());
    }

    render() {

    }
}

export default Kreise;