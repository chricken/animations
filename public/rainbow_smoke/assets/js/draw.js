'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import RainbowSmoke from './classes/rainbow_smoke.js';

const draw = {

    init() {
        let smoke = new RainbowSmoke({
            numIterationsAtAll: 500,
            noiseZoom: 5,
            numBalls: 20,
            showNoiseMult: 0,
            additionInflux: 120,
            dividerSimilarity: 40000,
            additionFilename: 'chricken_highly_detailed_ink_line_drawing_outlines_high_contras_5a53f025-1ef1-4256-85fa-5ad4645cb661.png',
            colorFilename: 'r1307294_17950605.jpg',
            additionToUse: 'fillAdditionTableBalls',
            addNoise: 0.0,
            additionsAvailable: [
                'fillAdditionTableSinus',
                'fillAdditionTablePerlin',
                'fillAdditionTableImg',
                'fillAdditionTableSinPlane',
                'fillAdditionTableJulia',
                'fillAdditionTableBalls'
            ]
        });
    }
}

export default draw;
export let render = draw.render;