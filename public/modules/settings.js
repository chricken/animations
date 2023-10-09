'use strict';

import helpers from './helpers.js';

const settings = {
    elements: {
        c: false,   // Standard-Canvas. Davon ausgehend, dass in dem Projekt mit einem einzelnen Canvas gearbeitet wird
    },
    fileIndex: 0,
    basePath: '',
    numPoints:100,
    padding:100,
    numImages:11000,
    get path() {
        let result = `${settings.basePath}_${helpers.leadingZero(settings.fileIndex, 4)}.png`;
        settings.fileIndex++;
        return result;
    }
}

export default settings;
export let elements = settings.elements;