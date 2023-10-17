'use strict';

import settings, { elements } from '../../../modules/settings.js';


const lStore = {
    loadSettings() {
        let savedSettings = localStorage.getItem('rainbowSmokeSettings');
        if (savedSettings) {
            savedSettings = JSON.parse(savedSettings);
            Object.entries(savedSettings).forEach(([key, value]) => {
                // console.log(key, value);
                settings[key] = value;
            })
        }
    },

    saveSettings() {
        localStorage.setItem('rainbowSmokeSettings', JSON.stringify(settings));
    }
}

export default lStore;