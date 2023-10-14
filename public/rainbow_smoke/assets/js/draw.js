'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import RainbowSmoke from './classes/rainbow_smoke.js';

const draw = {

    init() {
        let smoke = new RainbowSmoke({
            numIterationsAtAll:500,
            noiseZoom: 5,
            numBalls:15,
            showNoiseMult : 0,
            additionInflux: 50,
            dividerSimilarity : 20000,
            additionFilename: 'chricken_highly_detailed_ink_line_drawing_outlines_high_contras_5a53f025-1ef1-4256-85fa-5ad4645cb661.png',
            colorFilename: 'r1307294_17950605.jpg',
            //'fillAdditionTableSinus','fillAdditionTablePerlin','fillAdditionTableImg',
            // 'fillAdditionTableSinPlane','fillAdditionTableJulia','fillAdditionTableBalls'
            additionToUse: 'fillAdditionTableSinPlane',
            addNoise:0.01,
        });
    }
}

export default draw;
export let render = draw.render;