//初始化地图 Length:半径长度; size:格子大小
const installMap=(Length=5,BoxSize=12)=>{
    try{
        var maps = {}; //地图对象
        var resources = ['木', '石', '铁', '粮']; //资源类型
        var levels = [1, 2, 3, 4, 5]; //资源等级
        var Length = 10; // 地图半径
        var powers = ['势力1', '势力2', '势力3', '势力4']; //NPC势力

        //创建一个场景
        var scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xa0a0a0 );
        // scene.fog = new THREE.Fog( 0xa0a0a0, 80, 120 );

        //创建一个摄像机 属性:(视野,宽高比,近剪裁平面和远剪裁平面)
        var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
        camera.position.set( -10, 20, 10 );
        camera.up = new THREE.Vector3(0, 1, 0);
        camera.lookAt( 0, 0, 0 );
                

        //创建渲染器实例 设置我们希望它渲染应用程序的大小，浏览器窗口的宽度和高度
        var renderer = new THREE.WebGLRenderer({
            antialias:true,
            alpha:true
        });
        renderer.shadowMapEnabled = true;//开启阴影
        renderer.setClearColor(0x000000);//设置场景颜色
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('map').appendChild( renderer.domElement ); //添加实体

        // //辅助对象 三维箭头 红x 绿y 蓝z 
        // var axesHelper = new THREE.AxesHelper( 80 );
        // scene.add( axesHelper );
        // //阴影助手
        // var helper = new THREE.CameraHelper( light.shadow.camera );
        // scene.add( helper );

    //纹理图库
        // 创建一个纹理加载器
        var textureLoader = new THREE.TextureLoader();

        // 加载你想要的图片，这里假设你有四种不同的图片对应四种不同的资源
        var map1 = textureLoader.load('static/Map/imgs/map1.png');
        var iron2 = textureLoader.load('static/Map/imgs/铁2.png');
        var iron3 = textureLoader.load('static/Map/imgs/铁3.png');
        var iron4 = textureLoader.load('static/Map/imgs/铁4.png');
        var iron5 = textureLoader.load('static/Map/imgs/铁5.png');
        var tree2 = textureLoader.load('static/Map/imgs/木2.png');
        var tree3 = textureLoader.load('static/Map/imgs/木3.png');
        var tree4 = textureLoader.load('static/Map/imgs/木4.png');
        var tree5 = textureLoader.load('static/Map/imgs/木5.png');
        let irons = [map1,iron2,iron3,iron4,iron5]
        let trees = [map1,tree2,tree3,tree4,tree5]
        // 创建一个材质数组，用来存放不同的材质
        var materials = {};
        // 根据你的资源数组，为每种资源创建一个材质，并将其添加到材质数组中
        for(let i in resources){
            let materialArr=[]
            let texture
            switch (resources[i]) {
                case '木':
                texture = trees;
                break;
                case '石':
                texture = trees;
                break;
                case '铁':
                texture = irons;
                break;
                case '粮':
                texture = irons;
                break;
            }
            for(let i in texture){
                // 创建一个基本材质，使用双面和透明属性
                var material = new THREE.MeshBasicMaterial({
                    map: texture[i],
                    side: THREE.DoubleSide,
                    transparent: true
                });
                // 将材质添加到材质数组中
                materialArr.push(material);
            }
            materials[resources[i]]=materialArr
        }
        console.log(materials)

    //地图系统
        function map(){
            //创建地图格子
            for(let i=-Length;i<=Length;i++){
                for(let k=-Length;k<=Length;k++){
                    let xy = i + ',' + k;
                    let randomResource = resources[Math.floor(Math.random() * resources.length)];
                    let randomLevel = levels[Math.floor(Math.random() * levels.length)];
                    maps[xy] = { resource: randomResource, level: randomLevel }; 
                    iniPlane(BoxSize*(i),0,BoxSize*(k)/*,materials[randomResource][randomLevel-1]*/)
                }
            }
            //随机分配势力
            for (let p = 0; p < powers.length; p++) {
                let power = powers[p];
                while (true) {
                    let x = Math.floor(Math.random() * (2 * Length + 1)) - Length;
                    let y = Math.floor(Math.random() * (2 * Length + 1)) - Length;
                    if (canPlacePower(x, y)) {
                        placePower(x, y, power);
                        break;
                    }
                }
            }
        }
        map()
        console.log(maps)
        //创建地图网格
        function iniPlane(x,y,z,material=new THREE.MeshToonMaterial({color:0xf1f1f1,side:THREE.DoubleSide})) {

            //地板的对象
            var planeGeo = new THREE.PlaneGeometry(BoxSize, BoxSize);
            // var planeMat = new THREE.MeshLambertMaterial({color:0xf1f1f1,side:THREE.DoubleSide});
            var planeMat = material;
            var plane = new THREE.Mesh(planeGeo,planeMat);
            plane.receiveShadow = true;//接收阴影
            plane.castShadow = true;
            plane.position.set(x,y,z)
            plane.position.y = -0.01;//下沉0.01
            plane.rotation.x = 0.5 * Math.PI;//翻转90度
            //网格的对象 
            var grid = new THREE.GridHelper(BoxSize, 1, 0x000000, 0x000000);
            grid.material.transparent = true;//允许透明
            grid.material.opacity = 0.1;
            grid.position.set(x,y,z)
            //添加
            scene.add(plane);
            scene.add(grid);
        }
        //判断是否可以放置势力
        function canPlacePower(x, y) {
            for (let i = x; i < x + 3; i++) {
                for (let j = y; j < y + 3; j++) {
                    let xy = i + ',' + j;
                    if (maps[xy] && maps[xy].power) {
                        return false;
                    }
                }
            }
            return true;
        }
        //放置势力
        function placePower(x, y, power) {
            for (let i = x; i < x + 3; i++) {
                for (let j = y; j < y + 3; j++) {
                    let xy = i + ',' + j;
                    if (maps[xy]) {
                        maps[xy].power = power;
                        // 标记城中心和城区的位置
                        if (i == x + 1 && j == y + 1) {
                            maps[xy].type = '城中心';
                        } else {
                            maps[xy].type = '城区';
                        }
                    }
                }
            }
        }

    //光源系统
        var light = new THREE.DirectionalLight( 0xffffff, 0.8 ); //平行光
        var lightC=40
            light.position.set( 20, 40, 20 );
            light.castShadow = true; //允许产生阴影
            light.shadow.camera.left = - lightC;
            light.shadow.camera.right = lightC;
            light.shadow.camera.top = lightC;
            light.shadow.camera.bottom = - lightC;
            light.shadow.camera.near = 10;
            light.shadow.camera.far = 180;
            light.shadow.bias = - 0.001;
            light.shadow.mapSize.width = 1512;
            light.shadow.mapSize.height = 1512;
            scene.add( light );

        //渲染
        renderer.render( scene, camera );

        var texture = new THREE.TextureLoader().load( "static/Map/imgs/a1.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

    /*模型系统*/
        //导入模型
        var mtlLoader = new THREE.MTLLoader()
        var objLoader = new THREE.OBJLoader()
        mtlLoader.setPath('static/Map/obj/')
        mtlLoader.load('room1.mtl',function(materials){
            materials.preload();
            objLoader.setMaterials(materials)
        });
        objLoader.setPath('static/Map/obj/')
        objLoader.load('room1.obj',function(object){
            object.traverse(function(child) {
                if(child instanceof THREE.Mesh) {
                child.material.transparent=true;
                child.receiveShadow = true;//接收阴影
                child.castShadow = true;
                child.material.map = texture;
                }
            })
            object.position.set(-6,-6,6)
            object.transparent=true;
            object.opacity=0.5
            scene.add(object);
            renderer.render(scene,camera);
        },undefined,function(error){
            console.log(error)
        });


        // //导入地图模型
        // for(let i in maps){
        //     console.log(i,maps[i])
        //     for(let k in resources){
        //         if(maps[i].resource==resources[k]){

        //         }
        //     }

        // }

        document.addEventListener('click', onMapClick);
        // 点击地图格子时触发的操作
        // 创建一个点光源
        const pointLight = new THREE.PointLight(0x00ff00, 1, 10); // 绿色，强度为1，距离为10
        // 将点光源添加到场景中
        scene.add(pointLight);
        function onMapClick(event) {
            // 获取鼠标点击位置的坐标
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            // 创建一个射线
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            // 检测射线与地图格子的交点
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;
                // 检查材质是否存在
                if (intersectedObject.material.emissive) {

                    // 获取格子的坐标
                    const gridPosition = intersectedObject.position;
                    console.log('Clicked grid position:', gridPosition);
                    // 设置点光源的位置为点击的格子位置
                    pointLight.position.copy(gridPosition);
                }
            }
        }

        const BoxAnimate=()=>{
            // if (currentGlowingObject) {
            //     // 呼吸灯效果：改变发光强度
            //     const time = Date.now() * 0.001; // 根据时间计算强度
            //     const breathSpeed = 2; // 调整呼吸灯的速度，较小的值表示更快的变化
            //     const glowIntensity = 0.5 + 0.5 * Math.sin(time * breathSpeed); // 呼吸灯效果
            //     currentGlowingObject.material.emissiveIntensity = glowIntensity;
            // }
        }


    //轨道控制相机
    var controls = new THREE.OrbitControls( camera,document.getElementById('map')); //设置正确的绑定对象
        controls.enableDamping = true
        controls.dampingFactor=0.15
        controls.target=new THREE.Vector3(0,0,0);
        //禁止滚动
        controls.minPolarAngle= Math.PI/4;
        controls.maxPolarAngle= Math.PI/4;
        //禁止旋转
        controls.enableRotate = false
        controls.minAzimuthAngle = - Math.PI/4;
        controls.maxAzimuthAngle = - Math.PI/4;
        //禁止上下
        controls.minDistance=80
        controls.maxDistance=80
        controls.panSpeed=0.1
        controls.rotateSpeed=0.05
        controls.maxZoom=10
        controls.update();

        // 定义摄像头边界
        var bounds = {
            minX: - (Length * BoxSize) - 25,
            maxX: (Length * BoxSize) - 50,
            minZ: - (Length * BoxSize) + 50,
            maxZ: (Length * BoxSize) + 25
        };
        //添加事件监听器来限制摄像头位置
        controls.addEventListener('change', function() {
            // 检查X轴边界
            if (camera.position.x < bounds.minX ){
                camera.position.x = bounds.minX
            }else if(camera.position.x > bounds.maxX){
                camera.position.x = bounds.maxX
            }
            // 检查Y轴边界
            if (camera.position.z < bounds.minZ){
                camera.position.z = bounds.minZ
            }else if(camera.position.z > bounds.maxZ){
                camera.position.z = bounds.maxZ
            }
        });

        // 监听窗口大小变化事件
        window.addEventListener('resize', onWindowResize);
        function onWindowResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            // 更新渲染器的画布大小
            renderer.setSize(newWidth, newHeight);
            // 更新相机的视角和长宽比
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        }

        (function animate() {
            onWindowResize()
            requestAnimationFrame( animate );
            controls.update();
            BoxAnimate()
            renderer.render( scene, camera );
        })()

        return new Promise((resolve)=>{
            resolve()
        })
    }catch(err){
        console.log(err)
        return new Promise((reject)=>{
            reject(err)
        })
    }
}