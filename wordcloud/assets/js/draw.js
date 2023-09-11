'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { RtA, rnd } from '../../../modules/helpers.js';
import dom from '../../../modules/dom.js';

const numRect = 200, minSize = .01, maxSize = .05;

const draw = {
    render(c = elements.c) {
        // Random data
        let words = ["unwind", "leisure", "tranquility", "peace", "serenity", "calm", "rest", "ease", "comfort", "repose",
            "relax", "chill", "lounge", "meditate", "siesta", "nap", "vacation", "respite", "retreat", "recreation",
            "break", "holiday", "idyll", "pastime", "hobby", "entertainment", "fun", "laughter", "joy", "pleasure",
            "enjoyment", "quiet", "silence", "harmony", "balance", "zen", "yoga", "massage", "sauna", "spa",
            "jacuzzi", "bath", "soothe", "mellow", "soft", "gentle", "smooth", "still", "stillness", "quietude",
            "beach", "sand", "sea", "ocean", "waves", "sun", "nature", "garden", "park", "forest",
            "mountain", "lake", "river", "stream", "scenery", "view", "landscape", "horizon", "sunset", "sunrise",
            "moon", "stars", "sky", "clouds", "rain", "snow", "wind", "breeze", "storm", "thunder",
            "lightning", "rainbow", "bird", "animal", "flower", "tree", "grass", "leaf", "fruit", "water",
            "stone", "rock", "shell", "fire", "campfire", "tent", "hike", "walk", "run", "swim"]
            .map(function (d) {
                return { text: d, size: 10 + Math.random() * 90 };
            });

        let width = 500;
        let height = 500;

        let fill = d3.scaleOrdinal(d3.schemeCategory10); // color scheme

        let cloud = d3.layout.cloud()
            .size([width, height])
            .words(words)
            .padding(5)
            .rotate(() => (~~(Math.random() * 6) - 3) * 30)
            .font("Impact")
            .fontSize(d => d.size)
            .on("end", draw);

        cloud.start();

        function draw(words) {
            d3.select("body").append("svg")
                .attr("width", cloud.size()[0])
                .attr("height", cloud.size()[1])
                .attr("class", 'svgCloud')
                .append("g")
                .attr("transform", "translate(" + ~~(cloud.size()[0] / 2) + "," + ~~(cloud.size()[1] / 2) + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => d.size + "px")
                .style("font-family", "Impact")
                .style("fill", (d, i) => fill(i))
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text);

            let el = dom.$('.svgCloud');
            let ctx = elements.c.getContext('2d');

            console.log(el);

            ctx.drawImage(el, 50, 50, 50, 50)



        }

    }
}

export default draw;
export let render = draw.render;