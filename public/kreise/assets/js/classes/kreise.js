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
        this.maxNumberKreise = 100;
        this.hue = 0;
        this.sat = 70;
        this.deltaHue = 2;
        this.deltaSat = 2;
        this.abstand = 80;


        // abstand und winkel
        this.start = [this.abstand, 0];
        this.sp1a = [this.abstand, 0];
        this.sp2a = [this.abstand, 0];
        this.sp1b = [this.abstand, 0];
        this.sp2b = [this.abstand, 0];
        this.end = [this.abstand, 0];
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

        this.start[1] += 1;
        this.end[1] += -.8;
        this.sp1a[1] += 1.2;
        this.sp1b[1] += -1.4;

        // Farbe verändern
        this.hue += rnd(-this.deltaHue * 100, this.deltaHue * 100) / 100;

        // Neuen Kreis einhängen
        this.collection.push(new Kreis(
            [...this.start],
            [...this.sp1a],
            [...this.sp2a],
            [...this.end],
            [...this.sp1b],
            [...this.sp2b],
            this.hue,
        ))
        console.log(this.collection.length, this.maxNumberKreise);

        if (this.collection.length > this.maxNumberKreise) {
            this.collection.splice(0, 1);
        }

        this.collection.forEach(kreis => kreis.update());
    }

    render() {

    }
}

export default Kreise;