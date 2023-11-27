'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';
import draw from './draw.js';
import components from './components.js';
import lStore from './localstorage.js';

const fillApp = () => {
    // Canvas zeichnen
    elements.containerCanvasDraw = create({
        parent: elements.main,
        classes: ['container']
    })

    components.renewCanvas()

    // UI füllen
    const containerUI = create({
        type: 'div',
        classes: ['container', 'ui'],
        parent: elements.main,
    })

    // Schatten
    const cbShadow = components.checkbox({
        parent: containerUI,
        legend: 'Shadows',
        checked: settings.showShadows,
        callback() {
            settings.showShadows = cbShadow.checked;
            draw.step();
        }
    })

    // Spiegeln
    const cbMirror = components.checkbox({
        parent: containerUI,
        legend: 'Mirror',
        checked: settings.mirror,
        callback() {
            settings.mirror = cbMirror.checked;
            draw.step();
        }
    })

    // Schieber
    components.range({
        parent: containerUI,
        legend: 'Size',
        min: 1,
        max: settings.cSize.x,
        value: settings.size,
        callback(evt) {
            settings.size = evt.target.value;
            draw.step();
        }
    })

    // Linienbreite
    components.range({
        parent: containerUI,
        legend: 'Line Width',
        min: .2,
        max: settings.lineWidth * 5,
        value: settings.lineWidth,
        callback(evt) {
            settings.lineWidth = evt.target.value;
            draw.step();
        }
    })

    // Maximale Iterationstiefe
    components.range({
        parent: containerUI,
        legend: 'maxLevel',
        min: 1,
        max: settings.maxLevel * 3,
        value: settings.maxLevel,
        callback(evt) {
            settings.maxLevel = evt.target.value;
            draw.step();
        }
    })

    // Anzahl der Wurzeln
    components.range({
        parent: containerUI,
        legend: 'Num Roots',
        min: 1,
        max: 10,
        value: settings.numRoots,
        callback(evt) {
            settings.numRoots = evt.target.value;
            draw.step();
        }
    })

    // Anzahl der Zweige
    components.range({
        parent: containerUI,
        legend: 'Num Branches',
        min: 1,
        max: settings.numBranches * 3,
        value: settings.numBranches,
        callback(evt) {
            settings.numBranches = evt.target.value;
            draw.step();
        }
    })

    // Abstand vom Stamm
    components.range({
        parent: containerUI,
        legend: 'Distance',
        min: 0,
        max: settings.branchDistance * 3,
        value: settings.branchDistance,
        callback(evt) {
            settings.branchDistance = evt.target.value;
            draw.step();
        }
    })


    // Rotation
    components.range({
        parent: containerUI,
        legend: 'Rotation',
        min: 0,
        max: Math.PI,
        step: .01,
        value: settings.rotation,
        callback(evt) {
            settings.rotation = evt.target.value;
            draw.step();
        }
    })

    // Rotation Modification
    components.range({
        parent: containerUI,
        legend: 'Rotation Mod',
        min: -5,
        max: 100,
        step: .01,
        value: settings.rotationMod,
        callback(evt) {
            settings.rotationMod = evt.target.value;
            draw.step();
        }
    })
    // Scale
    components.range({
        parent: containerUI,
        legend: 'Scale',
        min: 0,
        max: 1,
        step: .01,
        value: settings.scale,
        callback(evt) {
            settings.scale = evt.target.value;
            draw.step();
        }
    })

    // Scale Modification
    components.range({
        parent: containerUI,
        legend: 'Scale Mod',
        min: -1,
        max: 1,
        step: .001,
        value: settings.scaleMod,
        callback(evt) {
            settings.scaleMod = evt.target.value;
            draw.step();
        }
    })

    // Offset
    components.range({
        parent: containerUI,
        legend: 'Offset Branch',
        min: 0,
        max: 1,
        step: .01,
        value: settings.offsetBranch,
        callback(evt) {
            settings.offsetBranch = evt.target.value;
            draw.step();
        }
    })

    // Beugung
    components.range({
        parent: containerUI,
        legend: 'Bow',
        min: -Math.PI / 2,
        max: Math.PI / 2,
        step: .01,
        value: settings.bow,
        callback(evt) {
            settings.bow = evt.target.value;
            draw.step();
        }
    })

    // Linie
    create({
        parent: containerUI,
        type: 'hr'
    })

    // Button zum Rendern
    create({
        type: 'button',
        parent: containerUI,
        content: 'Render',
        listeners: {
            click() {
                settings.fileNo = 0;
                settings.cancel = false;
                draw.init();
            }
        }
    })

    // Button zum Abbrechen
    create({
        type: 'button',
        parent: containerUI,
        content: 'Step',
        listeners: {
            click() {
                draw.step()
            }
        }
    })

    // Container for Previews
    elements.containerPreview = create({
        parent: containerUI,
        classes: ['container', 'preview']
    })
}

export default fillApp;