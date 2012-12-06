var Meteor = function (scene, pos)
{
    if (!Meteor.cnt) Meteor.cnt = 0;
    Meteor.cnt++;

    var material = new THREE.MeshPhongMaterial({
        ambient: 0x444444,
        color: Math.random() * 0x40c0c0,
        shininess: 300,
        specular: 0x33AA33,
        shading: THREE.SmoothShading
    });

    var size = 3;
    var geometry = new THREE.SphereGeometry(size, 12, 12);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = "meteor" + Meteor.cnt;
    mesh.position = pos.clone();
    mesh.controller = this;
    mesh.castShadow = true;
    scene.add(mesh);

    var position = mesh.position;
    position.y = Math.random() * 100 + 150;

    this.update = function (dt)
    {
        position.y -= dt / 100;
        if (position.y < -5) position.y = Math.random() * 100 + 150;
    };

    this.hit = function ()
    {
        if (mesh === null) return;

        var f = mesh.scale.x - 0.2;
        TweenLite.to(mesh.scale, 0.5, {x: f, y: f, z: f});

        if (f <= 0.1)
        {
            scene.remove(mesh);
            mesh = null;
        }
    };
};