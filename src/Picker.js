var Picker = function (scene, camera)
{
    var projector = new THREE.Projector();
    var mouse2D = new THREE.Vector3(0, 0, -1);

    this.getObjectsAt = function (x, y)
    {
        mouse2D.x = (x / window.innerWidth) * 2 - 1;
        mouse2D.y = -(y / window.innerHeight) * 2 + 1;

        var ray = projector.pickingRay(mouse2D.clone(), camera);

        var intersects = ray.intersectObjects(scene.children, false);

        if (intersects.length > 0)
        {
            for (var i = 0, l = intersects.length; i < l; i++)
            {
                console.log(intersects[i].object.name);
            }
        }

        return intersects;
    };
};