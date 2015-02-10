/**
 * Created by Lee on 2015-01-28.
 */

sGL.prototype.initCamera = function() {
    this.camera = new THREE.OrthographicCamera(
        this.targetView.width()/ - 100,this.targetView.width() / 100,
        this.targetView.height() / 100, this.targetView.height() / -100,
        0.1, 1000
    );

    this.camera.position.y = -10;
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.camera.rotation.z = 360  * Math.PI / 180;

    var size = 10,
        step = 1,
        gridHelper = new THREE.GridHelper( size, step );

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


        if( movedlist.length > 0 ) {
            for(var i = 0; i < movedlist.length; i++) {
                var item = movedlist[i].toJSON();
                var point = getNewPoint(item);
                self.scene.add(point);
            }
        }

    })



}

var getNewPoint = function(item) {
    var geometry = new THREE.SphereGeometry( 0.1, 100, 100 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( item.data.x,0, item.data.y);

    return sphere;
}