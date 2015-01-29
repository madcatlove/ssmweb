/**
 * Created by Lee on 2015-01-27.
 */

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
    this.camera = new THREE.PerspectiveCamera( 75, ratio, 0.1, 1000 );
    this.camera.position.set(5,7,10);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

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

        var item = eData.movedlist[0].toJSON();
        var boxSize = item.data.size,
            boxX = item.data.x,
            boxY = item.data.y,
            boxZ = item.data.z;


        //-----------------------------
        // 빛 추가
        //-----------------------------
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 1, 3, 1 );
        self.scene.add( directionalLight );


        //-----------------------------
        // 박스 추가
        //-----------------------------
        var geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize );
            geometry.applyMatrix( new THREE.Matrix4().makeTranslation( boxX, boxY, boxZ) );

        var material = new THREE.MeshPhongMaterial( {
            ambient: 0x333333,
            color: 0xffffff,
            emissive : 0xF7FF69,
            specular: 0xffffff,
            shininess: 50
        } );
        var cube = new THREE.Mesh( geometry, material );
        self.scene.add( cube );



    })
    /* END OF EVENT */



}
