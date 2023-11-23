'use strict';

import settings, { elements } from './settings.js';



const helpers = {

    // Errechnet aus relativen Werten zwischen 0 und 1 die Absolute Position im Canvas
    relToAbs(x, y, c = elements.c) {
        return [x * c.width, y * c.height];
    },

    // Erzeugen einer zufälligen Nummer
    createNumber(min, max, dec = 0) {
        dec = 10 ** dec;
        if (min > max) [min, max] = [max, min];
        return ~~((Math.random() * (max - min + (1 / dec)) + min) * dec) / dec;
    },

    // Erzeugen einer zufälligen Farbe
    createColor({ minHue = 0, maxHue = 360, minSat = 70, maxSat = 80, minLight = 60, maxLight = 80, minAlpha = 1, maxAlpha = 1 } = {}) {
        let rnd = helpers.createNumber;
        return `hsla(${rnd(minHue, maxHue)}, ${rnd(minSat, maxSat)}%, ${rnd(minLight, maxLight)}%, ${rnd(minAlpha * 100, maxAlpha * 100) / 100})`;
    },

    clamp(value, min, max) {
        value = Math.min(value, max);
        value = Math.max(value, min);
        return value;
    },

    // Pythagoras - a² = b² + c²
    pythagorasPoints(point1, point2, maxDistance = Infinity) {
        let a = 0, b = 0;
        if (point1.x) {
            a = point1.x - point2.x;
            b = point1.y - point2.y;
        }
        if (point1.posX) {
            a = point1.posX - point2.posX;
            b = point1.posY - point2.posY;
        }
        if (a == 0 && b == 0) {
            return maxDistance;
        } else {
            return Math.abs(Math.sqrt(a * a + b * b));
        }

    },

    pythagoras(a, b) {
        return Math.sqrt(a * a + b * b);
    },

    moveByAngleSpeed(x, y, angle, speed) {
        // sin a = gk / h
        // cos a = ak / h

        let deltaX = Math.sin(angle) * speed;
        let deltaY = Math.cos(angle) * speed;

        return [x + deltaX, y + deltaY];
    },

    // Inhalt des Canvas in eine Datei schreiben
    writeCToFile(c = elements.c) {
        console.log(settings.path);
        let image = c.toDataURL('image/png');  // Wandelt das Canvas in eine Data URL um
        let a = document.createElement('a');        // Erstellt einen neuen Download-Link

        a.href = image;                             // Setzt den Link auf das Bild
        a.download = settings.path;             // Legt den Namen der heruntergeladenen Datei fest
        a.click();

    },

    leadingZero(num, dec = 0) {
        let str = '00000000000000000';
        return (str + num).substr(-dec);

    },

    // Helper function to convert base64 image content to a blob
    base64ToBlob(base64, mime) {
        mime = mime || '';
        let sliceSize = 1024;
        let byteChars = window.atob(base64);
        let byteArrays = [];

        for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            let slice = byteChars.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mime });
    },

    HSLToRGB(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return { r, g, b };


    },

    angleToXY(distance, angle, centerX, centerY) {
        // sin a = gk / hyp
        // gk = sin a * hyp
        let x = Math.sin(angle / 180 * Math.PI) * distance;
        x = centerX + x;

        let y = Math.cos(angle / 180 * Math.PI) * distance;
        y = centerY + y;

        return [x, y];
    },

}

export default helpers;
export let RtA = helpers.relToAbs;
export let rnd = helpers.createNumber;
export let saveC = helpers.writeCToFile;
export let lead0 = helpers.leadingZero;
export let clamp = helpers.clamp;