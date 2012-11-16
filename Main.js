(function ()
{
    "use strict";

    // setup
    var section = new RunJump3D.Section("straight", 50).getAll();

    var scene;
    var camera;
    var renderer;

    var geometry;
    var material;
    var mesh;

    var player;

    init();
    requestAnimationFrame(animate);

    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    // create a spot light that casts shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-100, 25, 20);
    spotLight.shadowCameraNear = 1;
    spotLight.shadowCameraFar = 300;
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 0.9;
    spotLight.shadowCameraVisible = false;
    scene.add(spotLight);

    // create a point light
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 0;
    pointLight.position.y = 40;
    pointLight.position.z = 0;
    scene.add(pointLight);

    // add player
    material = new THREE.MeshPhongMaterial({
        ambient: 0x444444,
        color: Math.random() * 0xffffff,
        shininess: 300,
        specular: 0x33AA33,
        shading: THREE.SmoothShading
    });

    geometry = new THREE.SphereGeometry(5);
    player = new THREE.Mesh(geometry, material);
    player.castShadow = true;
    player.receiveShadow = false;
    var playerPosition = 5;
    player.position.y = playerPosition;
    scene.add(player);

    // level geometry
    geometry = new THREE.CubeGeometry(50, 1, 250);

    var texture = THREE.ImageUtils.loadTexture("assets/water.jpg");
    texture.repeat.set(0.7, 1);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    for (var i = 0, l = section.length; i < l; i++)
    {
        material = new THREE.MeshPhongMaterial({
            ambient: 0x444444,
            color: Math.random() * 0xffffff,
            shininess: 300,
            specular: 0x33AA33,
            shading: THREE.SmoothShading,
            map: texture
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = section[i].x - 250;
        mesh.position.y = section[i].y;
        mesh.position.z = 0;
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        scene.add(mesh);

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = section[i].x - 250;
        mesh.position.y = 50 - section[i].y;
        mesh.position.z = 0;
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    // controls
    var cameraRotation = 0;
    var cameraPosition = camera.position.y;
    document.addEventListener("click", function ()
    {
        cameraRotation = cameraRotation === 0 ? Math.PI : 0;
        TweenLite.to(camera.rotation, 1, {z: cameraRotation, delay: 0.1});

        cameraPosition = cameraPosition === 20 ? 50 - 20 : 20;
        TweenLite.to(camera.position, 1, {y: cameraPosition, delay: 0.1});

        playerPosition = playerPosition === 5 ? 50 - 5 : 5;
        TweenLite.to(player.position, 1, {y: playerPosition});
    });

    function init()
    {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = -100;
        camera.position.y = 20;
        camera.position.z = 50;
        camera.lookAt(-100, 0, 0);
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    var oldTime = Date.now();
    var speed = 1;

    function animate(time)
    {
        requestAnimationFrame(animate);

        var dt = time - oldTime;
        if (dt > 1000) dt = 1;
        oldTime = time;

        //speed += dt / 1000;

        camera.position.x += dt / 20 * speed;

        spotLight.position.x = pointLight.position.x = camera.position.x;

        player.position.x = camera.position.x;
        player.rotation.z -= cameraRotation === 0 ? dt / 200 * speed : -dt / 200 * speed;

        spotLight.target.position = player.position;

        renderer.render(scene, camera);
    }
})();
