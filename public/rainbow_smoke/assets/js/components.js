'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';

const components = {
    commonSettings(parent) {
        console.log(parent);

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

    inputFile({ parent, legend, callback }) {
        const container = create({
            type: 'div',
            parent
        })

        create({
            type: 'span',
            content: legend,
            parent: container,
        })

        const elInput = create({
            type: 'input',
            attr: {
                type: 'file',
            },
            parent: container,
            listeners: {
                change: callback
            }
        })
        return [elInput, container]
    },

    range({ parent, legend, callback, min, max, step,value }) {
        const container = create({
            parent,
            classes: ['container'],
        })

        // Beschriftung
        create({
            type: 'span',
            content: legend
        })

        // Range
        let inputRange = create({
            type: 'input',
            attr: {
                type: 'range',
                value, min, max, step,
            },
            parent: container,
            listeners: {
                input(evt) {
                    inputText.value = inputRange.value;
                    callback(evt);
                }
            }
        })

        let inputText = create({
            type: 'input',
            parent: container,
            attr: {
                value
            },
            listeners: {
                input(evt) {
                    inputRange.value = inputText.value;
                    callback(evt)
                }
            }

        })
    }
}

export default components;