'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import RainbowSmoke from './classes/rainbow_smoke.js';

const draw = {

    init() {
        let smoke = new RainbowSmoke({
            noiseZoom: 2,
            showNoiseMult : 30,
            additionInflux: 40,
            dividerSimilarity : 10000,
            additionFilename: 'alien2.png',
            //'fillAdditionTableSinus','fillAdditionTablePerlin','fillAdditionTableImg',
            // 'fillAdditionTableSinPlane','fillAdditionTableJulia','fillAdditionTableBalls'
            additionToUse: 'fillAdditionTableBalls',
            addNoise:.03,
        });
    }
}

export default draw;
export let render = draw.render;