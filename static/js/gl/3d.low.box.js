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
        console.log( 'movedlist' , movedlist );
        var isBegin = false;
        var tStack = [];
        var count = 0;

        for( var i = 0; i < movedlist.length; i++) {
            var item = movedlist[i];

            // 블락 타입이 BEGIN 인경우 추가.
            if( self.BEGIN == item.blockType ) {
                isBegin = true;
                continue;
            }

            if( self.END == item.blockType ) {
                /* 스타트가 되어있다면 */
                if(isBegin) {
                    if( tStack.length > 0 ) {
                        var line = getNewLine( tStack[0], tStack[tStack.length-1] );
                        self.scene.add(line);
                    }
                }
                isBegin = false;
                tStack = [];
                count = 0;
                continue;
            }

            if( isBegin ) {

                // 버텍스 3와 같다면.
                if( self.VERTEX3 == item.blockType ) {
                    tStack.push( item.toJSON() );
                    count++;

                    if( count >= 2 ) {
                        var item1 = tStack[count-2];
                        var item2 = tStack[count-1];
                        console.log( item1, item2 );
                        var line = getNewLine( item1, item2 );
                        self.scene.add(line);

                    }
                }
            }
            else{ // vertex만 집어 넣었을 땐 Point 찍음
                if(self.VERTEX3 == item.blockType){
                    var item = movedlist[i].toJSON();
                    var point = getNewPoint( item );
                    self.scene.add(point);
                }
            }
        } /* end for */

    })



}


var getNewPoint = function(item) {
    var geometry = new THREE.SphereGeometry( 0.1, 100, 100 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( item.data.x,item.data.y, item.data.z);

    return sphere;
}


var getNewLine = function( item1, item2 ) {
    var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( item1.data.x, item1.data.y, item1.data.z),
        new THREE.Vector3( item2.data.x, item2.data.y, item2.data.z)
    );
    var line = new THREE.Line( geometry, material );

    return line;
}