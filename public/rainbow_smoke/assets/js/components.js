'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';

const components = {
    checkbox({ parent, legend, callback, checked }) {
        let container = create({
            parent
        })

        create({
            parent: container,
            type: 'span',
            content: legend,
            classes: ['legend']
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
            classes: ['legend'],
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

    range({ parent, legend, callback, min, max, step, value }) {
        const container = create({
            parent,
            classes: ['container'],
        })

        // Beschriftung
        create({
            type: 'span',
            content: legend,
            parent: container,
            classes: ['legend']
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
                change(evt) {
                    inputText.value = eval(inputText.value);
                    inputRange.value = inputText.value;
                    callback(evt)
                }
            }

        })
    },

    selectbox({ parent, legend, callback, options, value}) {
        const containerSelect = create({
            parent,
            classes: ['container'],
        })

        create({
            type: 'span',
            content: legend,
            parent: containerSelect,
            classes: ['legend']
        })

        const elAuswahl = create({
            type: 'select',
            parent: containerSelect,
            listeners: {
                change: callback
            }
        })
        // None-Auswahl
        create({
            type: 'option',
            parent: elAuswahl,
            content: 'Bitte wählen',
            attr: {
                value: 'none'
            }
        })

        // Optionen für die Select
        options.forEach(addition => {
            create({
                type: 'option',
                parent: elAuswahl,
                content: addition.text,
                attr: {
                    value: addition.value
                }
            })
        })
        elAuswahl.value = value;
    },

    textbox({parent, value, callback, legend}){
        let container = create({
            parent,
            classes: ['container'],
        })

        create({
            parent: container,
            type: 'span',
            content: legend,
            classes: ['legend']
        })

        let cb = create({
            type: 'input',
            parent: container,
            attr: {
                type: 'text',
                value
            },
            listeners: {
                change: callback
            }
        })
    }
}

export default components;