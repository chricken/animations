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
        this.abstand = 80;

        // abstand und winkel
        this.start = [this.abstand, 0, c.width / 6, c.height / 2];
        this.sp1a = [this.abstand, 0, c.width / 5, 0];
        this.sp2a = [this.abstand, 0, c.width / 4 * 3, 0];
        // this.sp1b = [this.abstand, 0];   // Werden im Render-Prozess errechnet
        // this.sp2b = [this.abstand, 0];
        this.end = [this.abstand, 0, c.width / 6 * 5, c.height / 2];
        this.collection = [];
        this.update();
    }
    rnd() {
        let speed = 150;
        return rnd(-speed, speed) / 100
    }
    update() {

        let c = elements.c;
        let ctx = c.getContext('2d');


        this.start = [
            this.start[0] + rnd(-10, 10) / 100,
            this.start[1] - rnd(-5, 30) / 100,
            this.start[2] + rnd(-20, 20) / 100,
            this.start[3] + rnd(-20, 20) / 100,
        ];
        this.end = [
            this.end[0] + rnd(-10, 10) / 100,
            this.end[1] + rnd(-5, 30) / 100,
            this.end[2] + rnd(-20, 20) / 100,
            this.end[3] - rnd(-20, 20) / 100,
        ];
        this.sp1a = [
            this.sp1a[0] + rnd(-10, 10) / 100,
            this.sp1a[1] + rnd(-5, 30) / 100,
            this.sp1a[2] + rnd(-20, 20) / 100,
            this.sp1a[3] + rnd(-20, 20) / 100,
        ];
        this.sp2a = [
            this.sp2a[0] - rnd(-10, 10) / 100,
            this.sp2a[1] - rnd(-5, 30) / 100,
            this.sp2a[2] + rnd(-20, 20) / 100,
            this.sp2a[3] + rnd(-20, 20) / 100,
        ];

        // Farbe verändern
        this.hue += rnd(-this.deltaHue * 100, this.deltaHue * 100) / 100;

        // Neuen Kreis einhängen
        this.collection.push(new Kreis(
            [...this.start],
            [...this.sp1a],
            [...this.sp2a],
            [...this.end],
            // [...this.sp1b],
            // [...this.sp2b],
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