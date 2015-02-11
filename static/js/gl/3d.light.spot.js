/**
 * Created by Lee on 2015-01-27.
 */

sGL.prototype.initRenderer = function() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    this.renderer.setSize( this.targetView.width() , this.targetView.height() );
    return this;
}

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
    this.camera = new THREE.PerspectiveCamera( 75, ratio, 1, 3000 );
    this.camera.position.set(100, 100, 200);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Orbit
    var controls = new THREE.OrbitControls(this.camera, this.targetView.get(0) ); // jQuery 객체를 일반 DOM 객체로 변환
    controls.damping = 0.2;


    // Grid helper
    var size = 10;
    var step = 1;
    var gridHelper = new THREE.GridHelper( size, step );
    this.scene.add( gridHelper );

    //-------------------------------------
    // X, Y ,Z 좌표축 설정
    //-------------------------------------
    var axes = buildAxes( 1000 );
    this.scene.add( axes );

    //-------------------------------------
    // 큐브 설정 및 땅 추가
    //-------------------------------------
    var sCube = buildCube(),
        sGround = buildGround();
    this.scene.add( sCube );
    this.scene.add( sGround );


    //-----------------------------
    // 빛 추가
    //-----------------------------
    this.light = new THREE.SpotLight(0xffffff,0.5);
    this.light.position.set(-100, 100, 100 );
    this.light.castShadow = true;
    this.light.shadowDarkness = 0.5;
    this.light.shadowCameraVisible = true;
    this.scene.add( this.light );

    //-----------------------------
    // 더미 추가
    //-----------------------------
    var sDummy = buildDummy();
    this.scene.add( sDummy );
    this.light.target = sDummy;


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


    function buildCube() {
        var geometry = new THREE.BoxGeometry( 50, 50, 50 );
        var material = new THREE.MeshPhongMaterial( {
            ambient: 0x333333,
            color: 0xffffff,
            emissive : 0xF7FF69,
            specular: 0xffffff,
            shininess: 50
        } );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.set(0,25,0);
        cube.castShadow = true;
        cube.receiveShadow = false;

        return cube;
    }


    function buildGround() {
        var geometry2 = new THREE.PlaneBufferGeometry(1000,1000);
        var material2 = new THREE.MeshPhongMaterial( {
            ambient: 0x333333,
            color: 0xffffff,
            emissive : 0xAAAAAAA,
            specular: 0xffffff,
            shininess: 50
        } );
        var plane = new THREE.Mesh( geometry2, material2 );
        plane.position.set(0,0,0);
        plane.rotation.x = -90*Math.PI/180;
        plane.castShadow = true;
        plane.receiveShadow = true;

        return plane;
    }


    function buildDummy() {
        var dummyGeometry = new THREE.SphereGeometry(1,1,1);
        var dummyMaterial = new THREE.MeshBasicMaterial({
            color : 0x00fffff
        });
        var dummy = new THREE.Mesh(dummyGeometry,dummyMaterial);
        dummy.position.set(0,100,0);

        return dummy;
    }


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

        for( var i = 0; i < movedlist.length ; i++) {
            var item = movedlist[i].toJSON();

            if ( item.blockType == self.LIGHTPOSITION ) {
                var x = item.data.x,
                    y = item.data.y,
                    z = item.data.z;

                x *= 10;
                y *= 10;
                z *= 10;
                self.light.position.set(x,y,z);
            }
            else if( item.blockType == self.LIGHTDIRECTION ) {
                console.log( ' sdfsd f? ')
                var x = item.data.x,
                    y = item.data.y,
                    z = item.data.z;

                x *= 1000;
                y *= 1000;
                z *= 1000;
                self.light.target.position.set( x, y, z );
            }
            else if( item.blockType == self.SPOTLIGHT ) {
                var hex = item.data.hex,
                    intensity = item.data.intensity,
                    angle = item.data.angle,
                    exp = item.data.exp;

                self.light.color.setHex(hex);
                self.light.intensity = 1/intensity;
                self.light.angle = angle*Math.PI/180;
                self.light.exponent = exp;
            }

        }




    })
    /* END OF EVENT */



}
