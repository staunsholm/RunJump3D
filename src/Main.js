(function ()
{
    // setup
    var section = new Section("straight", 100).getAll();

    var scene;
    var camera;
    var renderer;

    var geometry;
    var material;
    var mesh;

    var player;

    init();

    var ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);

    // create a spot light that casts shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-100, 70, 20);
    spotLight.shadowCameraNear = 50;
    spotLight.shadowCameraFar = 100;
    spotLight.shadowCameraFov = 90;
    spotLight.shadowBias = 0.0001;
    spotLight.shadowDarkness = 0.5;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 0.7;
    spotLight.shadowCameraVisible = false;
    scene.add(spotLight);

    // create a point light
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 0;
    pointLight.position.y = 40;
    pointLight.position.z = 0;
    scene.add(pointLight);

    var ground;
    var buildings = [];
    var meteors = [];

    SetupCity();

    for (var i = 0; i < buildings.length; i++)
    {
        meteors.push(new Meteor(scene, buildings[i].position));
    }

    function SetupGeometry()
    {
        // add player
        material = new THREE.MeshPhongMaterial({
            ambient: 0x444444,
            color: Math.random() * 0xffffff,
            shininess: 300,
            specular: 0x33AA33,
            shading: THREE.SmoothShading
        });

        geometry = new THREE.SphereGeometry(5, 8, 8);
        player = new THREE.Mesh(geometry, material);
        player.castShadow = true;
        player.receiveShadow = false;
        var playerPosition = 5;
        player.position.y = playerPosition;
        scene.add(player);

        // level geometry
        var texture = THREE.ImageUtils.loadTexture("assets/water.jpg");
        texture.repeat.set(0.7, 1);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        material = new THREE.MeshPhongMaterial({
            ambient: 0x0,
            color: Math.random() * 0xffffff,
            shininess: 100,
            specular: 0x333355,
            diffuse: 0x0,
            shading: THREE.SmoothShading,
            map: null,
            wireframe: true
        });

        geometry = new THREE.TwisterGeometry(section.length * 30, 200, section.length, 1, section);

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 150;
        mesh.position.y = 50;
        mesh.position.z = -50;
        mesh.rotation.x = -Math.PI / 2;
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        scene.add(mesh);

        geometry = new THREE.TwisterGeometry(section.length * 30, 200, section.length, 1, section);

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 150;
        mesh.position.y = 0;
        mesh.position.z = -50;
        mesh.rotation.x = -Math.PI / 2;
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    function SetupCity()
    {
        material = new THREE.MeshPhongMaterial({
            ambient: 0x444444,
            color: 0x10c040,
            shininess: 300,
            specular: 0x33AA33,
            shading: THREE.SmoothShading
        });

        geometry = new THREE.CubeGeometry(100, 1, 100);
        ground = new THREE.Mesh(geometry, material);
        ground.castShadow = false;
        ground.receiveShadow = true;
        scene.add(ground);

        for (var i = 0; i < 20; i++)
        {
            material = new THREE.MeshPhongMaterial({
                ambient: 0x444444,
                color: Math.random() * 0x40c0c0,
                shininess: 300,
                specular: 0x33AA33,
                shading: THREE.SmoothShading
            });

            var h = Math.random() * 30 + 10;
            geometry = new THREE.CubeGeometry(5, h, 8);
            var building = new THREE.Mesh(geometry, material);
            building.castShadow = true;
            building.receiveShadow = true;
            building.position.x = Math.random() * 100 - 50;
            building.position.y = h / 2;
            building.position.z = Math.random() * 40 - 40;
            ground.add(building);

            buildings.push(building);
        }
    }

    // controls
    var cameraRotation = 0;
    var cameraPosition = camera.position.y;

    requestAnimationFrame(animate);

    var go = false;
    var picker = new Picker(scene, camera);
    document.addEventListener("click", function (e)
    {
        var picked = picker.getObjectsAt(e.clientX, e.clientY);

        if (picked.length > 0)
        {
            if (picked[0].object && picked[0].object.name !== "")
            {
                picked[0].object.controller.hit();
            }
        }
        return;

        if (!go)
        {
            //toggleFullScreen();
            go = true;
            return;
        }

        cameraRotation = cameraRotation === 0 ? Math.PI : 0;
        TweenLite.to(camera.rotation, 1, {z: cameraRotation, delay: 0.1});

        cameraPosition = cameraPosition === 20 ? 50 - 20 : 20;
        TweenLite.to(camera.position, 1, {y: cameraPosition, delay: 0.1});

        playerPosition = playerPosition === 5 ? 50 - 5 : 5;
        TweenLite.to(player.position, 1, {y: playerPosition});
    });

    function init()
    {
        var width = window.innerWidth;
        var height = window.innerHeight;

        camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 10;
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(0, 30, 0));
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = false;
        renderer.setSize(width, height);
        document.body.appendChild(renderer.domElement);
    }

    var oldTime = Date.now();
    var speed = 0;
    var pixelValues = new Uint8Array(4 * 640 * 480);

    function animate(time)
    {
        requestAnimationFrame(animate);

        var dt = time - oldTime;
        if (dt > 1000) dt = 1;
        oldTime = time;

//        speed += dt / 5000;
        if (!go) speed = 0;

        camera.position.x += dt / 20 * speed;

        spotLight.position.x = pointLight.position.x = camera.position.x;

//        player.position.x = camera.position.x;
//        player.rotation.z -= cameraRotation === 0 ? dt / 200 * speed : -dt / 200 * speed;

//        spotLight.target.position = player.position;

        ground.rotation.y = Math.sin(time / 1000) / 8;

        for (var i = 0; i < 10; i++)
        {
            meteors[i].update(dt);
        }

        renderer.render(scene, camera);

        var gl = renderer.getContext();
        gl.readPixels(0, 0, 640, 480, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
    }
})();
