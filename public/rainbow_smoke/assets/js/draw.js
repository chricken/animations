'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import RainbowSmoke from './classes/rainbow_smoke_2.js';

const draw = {

    init() {
        let smoke = new RainbowSmoke();
    }
}

export default draw;
export let render = draw.render;