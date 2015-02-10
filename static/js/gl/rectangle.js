/**
 * Created by Lee on 2015-01-27.
 */

sGL.prototype.initCamera = function() {
    this.camera = new THREE.OrthographicCamera(
        this.targetView.width()/ - 100,this.targetView.width() / 100,
        this.targetView.height() / 100, this.targetView.height() / -100,
        0.1, 1000
    );


    this.camera.position.y = -10;
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    //   this.camera.rotation.x = 180  * Math.PI / 180;
    this.camera.rotation.z = 360  * Math.PI / 180;



    var size = 10;
    var step = 1;
    var gridHelper = new THREE.GridHelper( size, step );
    this.scene.add( gridHelper );

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
                continue;
            }

            if( isBegin ) {

                // 버텍스 2와 같다면.
                if( self.VERTEX2 == item.blockType ) {
                    tStack.push( item.toJSON() );
                    count++;

                    if( count >= 2 ) {
                        var item1 = tStack[count-2];
                        var item2 = tStack[count-1];
                        var line = getNewLine( item1, item2 );
                        self.scene.add(line);

                    }
                }
            }
            else{ // vertex만 집어 넣었을 땐 Point 찍음
                if(self.VERTEX2 == item.blockType){
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
    sphere.position.set( item.data.x,0, item.data.y);

    return sphere;
}

var getNewLine = function( item1, item2 ) {
    var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( item1.data.x,-5, item1.data.y),
        new THREE.Vector3( item2.data.x,-5, item2.data.y)
    );
    var line = new THREE.Line( geometry, material );

    return line;
}