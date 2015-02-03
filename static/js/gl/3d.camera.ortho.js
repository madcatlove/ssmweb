/**
 * Created by Lee on 2015-01-27.
 */

//--------------------------------
// 전역변수
//--------------------------------
var _CAMERA_PERS,
    _CAMERA_ORTHO;



sGL.prototype.renders = function() {
    //console.log( sGL.prototype.render );
    var _self = this;
    var render = function() {
        requestAnimationFrame( render );
        _self.renderer.render( _self.scene, _self.camera );
    }
    render();

}


sGL.prototype.initCamera = function() {
    // 3D용 카메라 세팅
    var ratio = this.targetView.width() / this.targetView.height();
    var SCREEN_WIDTH = this.targetView.width(),
        SCREEN_HEIGHT = this.targetView.height();

    _CAMERA_ORTHO = new THREE.OrthographicCamera( SCREEN_WIDTH / - 100, SCREEN_WIDTH / 100, SCREEN_HEIGHT / 100, SCREEN_HEIGHT / - 100, -10, 155);
    _CAMERA_PERS = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100);


    this.camera = _CAMERA_ORTHO;
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // Orbit
    //var controls = new THREE.OrbitControls(this.camera, this.targetView.get(0) ); // jQuery 객체를 일반 DOM 객체로 변환
    //controls.damping = 0.2;


    // Grid helper
    var size = 70;
    var step = 1;
    var gridHelper = new THREE.GridHelper( size, step );
    this.scene.add( gridHelper );

    //-------------------------------------
    // X, Y ,Z 좌표축 설정
    //-------------------------------------
    var axes = buildAxes( 1000 );
    this.scene.add( axes );

    //-----------------------------
    // 박스 생성
    //-----------------------------
    makeBox( this.scene );


    function makeBox( scene ) {
        for(var i=0; i<100; i++){
            var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            var material = new THREE.MeshPhongMaterial({
                ambient: 0x333333,
                color: 0xffffff,
                emissive: 0xF7FF69,
                specular: 0xffffff,
                shininess: 50
            });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(-30+i, 0.25, 30-i);

            scene.add(cube);
        }
    }

    function buildAxes( length ) {
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

    }

    function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

    }
    //-------------------------------------

    return this;
}


sGL.prototype.run = function() {

    var self = this;

    // 삭제된 이벤트가 발생하면 전부 재 랜더링.
    $(document).on('removedEvent', function(event) {
        self.reconstruct();
    })


    $(document).on('movedEvent', function(event, eData) {
        var movedlist = eData.movedlist;

        if( movedlist.length < 1 ) return false;

        //var item = eData.movedlist[0].toJSON();
        //var boxSize = item.data.size,
        //    boxX = item.data.x,
        //    boxY = item.data.y,
        //    boxZ = item.data.z;


        //-----------------------------
        // 빛 추가
        //-----------------------------
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 1, 3, 1 );
        self.scene.add( directionalLight );

        for( var i = 0; i < movedlist.length ; i++) {
            var item = movedlist[i].toJSON();

            if( item.blockType == self.PERSPECTIVE ) {
                self.camera = switchCameraToPers( item )
            }
            else if( item.blockType == self.DRAWBOX ) {
                drawBox(item, self.scene );
            }
            else if( item.blockType == self.OTHOGRAPHIC ) {
                self.camera = switchCameraToOrtho( item )
            }


        }




    })
    /* END OF EVENT */


}

function switchCameraToPers(item) {
    var camera = _CAMERA_PERS;
    camera.fov  = Number( item.data.fov );
    //      camera.aspect = aspect;
    camera.near = Number( item.data.near );
    camera.far  =  Number( item.data.far );
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    return camera;
}

function switchCameraToOrtho(item) {
    var camera = _CAMERA_ORTHO;
    camera.left     = Number(item.data.left);
    camera.right    = Number(item.data.right);
    camera.bottom   = Number(item.data.bottom);
    camera.top      = Number(item.data.top);
    camera.near     = Number(item.data.near);
    camera.far      = Number(item.data.far);
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    return camera;
}



function drawBox( item, scene ) {
    var geometry = new THREE.BoxGeometry( item.data.size , item.data.size , item.data.size );
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( item.data.x, item.data.y, item.data.z) );

    var material = new THREE.MeshPhongMaterial( {
        ambient: 0x333333,
        color: 0xff0000,
        emissive : 0xff0000,
        specular: 0xffffff,
        shininess: 100
    } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
}