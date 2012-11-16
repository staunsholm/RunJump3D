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
            x: i * 50,
            y: 0
        });
    }

    /**
     * Get part of section
     * @param type
     * @param start
     * @param end
     * @param seed
     */
    this.getPart = function (start, end)
    {
        return section.slice(start, end);
    };

    this.getAll = function ()
    {
        return section;
    };
};