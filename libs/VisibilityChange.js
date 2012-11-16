(function ()
{
    "use strict";

    var hidden, change, vis = {
        hidden: "visibilitychange",
        mozHidden: "mozvisibilitychange",
        webkitHidden: "webkitvisibilitychange",
        msHidden: "msvisibilitychange",
        oHidden: "ovisibilitychange" /* not currently supported */
    };
    for (hidden in vis)
    {
        if (vis.hasOwnProperty(hidden) && hidden in document)
        {
            change = vis[hidden];
            break;
        }
    }
    if (change)
    {
        document.addEventListener(change, onchange);
    }
    else
    {
        window.onfocus = window.onblur = onchange;
    }

    function onchange(evt)
    {
        evt = evt || window.event;

        if (evt.type === "focus" || evt.type === "focusin" || this[hidden])
        {
            onfocus();
        }
        else
        {
            onblur();
        }
    }

    function onfocus()
    {
    }

    function onblur()
    {
    }
})();