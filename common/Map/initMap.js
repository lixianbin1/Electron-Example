const installMap=()=>{
    try{
    //创建一个场景
    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 80, 120 );


    //创建一个摄像机 属性:(视野,宽高比,近剪裁平面和远剪裁平面)
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
    camera.position.set( -10, 20, 10 );
    camera.lookAt( 0, 0, 0 );
                

    //创建渲染器实例 设置我们希望它渲染应用程序的大小，浏览器窗口的宽度和高度
    var renderer = new THREE.WebGLRenderer({
        antialias:true,
        alpha:true
    });
    renderer.shadowMapEnabled = true;//开启阴影
    renderer.setClearColor(0x000000);//设置场景颜色
    renderer.setSize( window.innerWidth, window.innerHeight );
    //添加实体
    
    document.getElementById('map').appendChild( renderer.domElement );

    //辅助对象 三维箭头 红x 绿y 蓝z 
    var axesHelper = new THREE.AxesHelper( 80 );
    scene.add( axesHelper );

    //地图系统
    var maps=[]
    map(0,0)
    console.log(maps)
    function map(x,y){
        for(let i=-2;i<=2;i++){
            for(let k=-2;k<=2;k++){
                let has=true//判断是否在坐标中存在
                let xy=(i+x)+','+(k+y)
                for(let j in maps){
                    if(maps[j]==xy){
                        has=false
                        break
                    }
                }
                if(has){
                    maps.push(xy)
                    iniPlane(12*(i+x),0,12*(k+y))
                }
            }
        }
    }

    //平行光
    var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
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
    //阴影助手
    var helper = new THREE.CameraHelper( light.shadow.camera );
        scene.add( helper );

    //渲染
    renderer.render( scene, camera );


    var texture = new THREE.TextureLoader().load( "./common/Map/imgs/a1.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

    //导入模型
    var mtlLoader = new THREE.MTLLoader()
    var objLoader=new THREE.OBJLoader()
    mtlLoader.setPath('./common/Map/obj/')
    mtlLoader.load('room1.mtl',function(materials){
        materials.preload();
        objLoader.setMaterials(materials)
        objLoader.setPath('./common/Map/obj/')
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
    });

    //网格
    function iniPlane(x,y,z) {
        //地板
        var planeGeo = new THREE.PlaneGeometry(12, 12);
        var planeMat = new THREE.MeshLambertMaterial({color:0xf1f1f1,side:THREE.DoubleSide});
        var plane = new THREE.Mesh(planeGeo,planeMat);
        plane.receiveShadow = true;//接收阴影
        plane.castShadow = true;
        plane.position.set(x,y,z)
        plane.position.y = -0.01;//下沉0.01
        plane.rotation.x = 0.5 * Math.PI;//翻转90度
        //网格的对象 
        var grid = new THREE.GridHelper(12, 1, 0x000000, 0x000000);
        grid.material.transparent = true;//允许透明
        grid.material.opacity = 0.1;
        grid.position.set(x,y,z)
        //添加
        scene.add(plane);
        scene.add(grid);
    }

    //轨道控制相机
    var controls = new THREE.OrbitControls( camera,document.getElementById('map')); //设置正确的绑定对象
        controls.enableDamping = true
        controls.dampingFactor=0.15
        controls.minPolarAngle= Math.PI/8;
        controls.maxPolarAngle= Math.PI/3;
        controls.panSpeed=0.1
        controls.rotateSpeed=0.05
        controls.maxZoom=10
        controls.minDistance=50
        controls.maxDistance=80
        controls.update();

        // // 定义边界
        // var bounds = {
        //     minX: -40,
        //     maxX: 40,
        //     minZ: -40,
        //     maxZ: 40
        // };
        // // 添加事件监听器来限制摄像头位置
        // controls.addEventListener('change', function() {
        //     console.log(camera.position.x,camera.position.y,camera.position.z)
        //     console.log(camera.position.x/camera.position.y)
        //     // 检查X轴边界
        //     if (camera.position.x < bounds.minX) {
        //         camera.position.x = bounds.minX;
        //         camera.position.y = bounds.minX/-0.52
        //         camera.position.z = bounds.minX/-1
        //     } else if (camera.position.x > bounds.maxX) {
        //         camera.position.x = bounds.maxX;
        //         camera.position.y = bounds.maxX/-1
        //         camera.position.z = bounds.maxX/-0.52
        //     }
            
        //     // 检查Y轴边界
        //     if (camera.position.z < bounds.minZ) {
        //         camera.position.z = bounds.minZ;
        //         camera.position.y = -0.52*bounds.minZ;
        //         camera.position.x = - bounds.minZ;
        //     } else if (camera.position.z > bounds.maxZ) {
        //         camera.position.z = bounds.maxZ;
        //         camera.position.y = -0.52*bounds.maxZ;
        //         camera.position.x = - bounds.maxZ;
        //     }
        // });


        (function animate() {
            requestAnimationFrame( animate );

            //创建新地块
            // var target=controls.target
            // let tarX,tarY
            // if(Math.abs(target.x-0)>12){
            //     if(target.x>0){
            //         tarX=Math.ceil((target.x-12)/24)
            //     }else{
            //         tarX=Math.floor((target.x+12)/24)
            //     }
            // }else{
            //     tarX=0
            // }
            // if(Math.abs(target.z-0)>12){
            //     if(target.z>0){
            //         tarY=Math.ceil((target.z-12)/24)
            //     }else{
            //         tarY=Math.floor((target.z+12)/24)
            //     }
            // }else{
            //     tarY=0
            // }
            // console.log(tarX,tarY) //中心坐标
            // map(tarX,tarY) //根据摄像头移动，创建新地块
            controls.update();
            renderer.render( scene, camera );
        })()


        //注册事件
        var originalPosition = new THREE.Vector3(0, 0, 0); // 根据需要调整
        var originalRotation = new THREE.Euler(0, 0, 0); // 根据需要调整
        $('#resetButton').click(function() {
            camera.position.copy(originalPosition);
            camera.rotation.copy(originalRotation);
            // 如果你使用了OrbitControls，你可能还需要重置控制器的目标
            if (controls) {
                controls.target.set(0, 0, 0);
                controls.update();
            }
            // 重新渲染场景
            renderer.render(scene, camera);
        });

        return new Promise((resolve)=>{
            resolve()
        })
    }catch(err){
        return new Promise((reject)=>{
            reject()
        })
    }
}