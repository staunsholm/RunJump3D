var RunJump3D = RunJump3D || {};

RunJump3D.Section = function (type, length, seed)
{
    "use strict";

    if (!seed) seed = 1337;

    var section = [];

    // create section
    var random = new MersenneTwister(seed);

    for (var i = 0; i < length; i++)
    {
        section.push({
            x1: i * 50,
            y1: random.genrand_real1() < 0.1 ? 20 : 0,
            x2: i * 50,
            y2: random.genrand_real1() < 0.1 ? 50 : 70
        });
    }

    /**
     * Get part of section
     * @param start
     * @param end
     */
    this.getPart = function (start, end)
    {
        return section.slice(start, end);
    };

    /**
     * returns entire section
     * @return {Array}
     */
    this.getAll = function ()
    {
        return section;
    };
};