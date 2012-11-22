function toggleFullScreen()
{
    var videoElement = document.getElementsByTagName("canvas")[0];
    if (!document.mozFullScreen && !document.webkitFullScreen)
    {
        if (videoElement.mozRequestFullScreen)
        {
            videoElement.mozRequestFullScreen();
        }
        else
        {
            videoElement.webkitRequestFullScreen();
        }
    }
    else
    {
        if (document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        }
        else
        {
            document.webkitCancelFullScreen();
        }
    }

    lockScreenOrientation();
}

function lockScreenOrientation()
{
    var result = false;

    if (window.screen && window.screen.lockOrientation)
    {
        result = window.screen.lockOrientation("landscape");
    }
    else if (window.screen && window.screen.mozLockOrientation)
    {
        result = window.screen.mozLockOrientation("landscape");
    }

    if (!result)
    {
        setTimeout(lockScreenOrientation, 100);
    }
}

