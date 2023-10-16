'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';

const components = {
    commonSettings(parent) {
        console.log(parent);

        /*
        saveFile: false,
        // Größe des zu rendernden Bildes
        cSize: {
            x: ~~(1920 / 40),
            y: ~~(1040 / 40),
        },
        */
        // Canvas Size
        components.range({
            parent,
            legend: 'Canvas Size X',
            value: 500,
            min: 50,
            max: 4000,
            callback(evt) {
                settings.cSize.x = evt.value;
                console.log(settings);
            }
        })

        // Save File
        components.checkbox({
            parent,
            legend: 'Save File?',
            checked: settings.saveFile,
            callback(evt) {
                settings.saveFile = evt.target.checked;
            }
        })

    },

    checkbox({ parent, legend, callback, checked }) {
        let container = create({
            parent
        })

        create({
            parent: container,
            type: 'span',
            content: legend
        })

        let cb = create({
            type: 'input',
            parent: container,
            attr: {
                type: 'checkbox',

            },
            listeners: {
                change: callback
            }
        })
        if (checked) cb.checked = true;
    },

    inputFile({parent, legend, callback}){
        const container = create({
            type:'div',
            parent
        })

        create( {
            type:'span',
            content: legend,
            parent: container,
        })

        create({
            type:'input',
            attr:{
                type:'file',
            },
            parent: container,
            listeners:{
                click: callback
            }
        })
    },

    range({ parent, legend, callback, min, max, value }) {
        const container = create({

        })
    }
}

export default components;