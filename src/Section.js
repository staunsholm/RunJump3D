/**
 * Section Class
 * @constructor
 */
var Section = function (type, length, seed)
{
    if (!seed) seed = 1337;

    var section = [];

    // create section
    var random = new MersenneTwister(seed);

    for (var i = 0; i < length; i++)
    {
        section.push({
            x1: i * 10,
            y1: Math.sin(i / 20) * 10,
            x2: i * 10,
            y2: Math.sin(i / 20) * 10
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