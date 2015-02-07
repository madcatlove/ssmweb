/**
 * Created by Lee on 2015-01-29.
 */

var CTMPivot;
var colorStack = new Array();
var index = 0;
colorStack.push(new THREE.Color(0xffffff));
colorStack.push(new THREE.Color(0xff0000));
colorStack.push(new THREE.Color(0x00ff00));
colorStack.push(new THREE.Color(0x00ffff));
colorStack.push(new THREE.Color(0xAA00ff));
colorStack.push(new THREE.Color(0xAA00AA));
sGL.prototype.initCamera = function() {
    // 3D용 카메라 세팅
    var ratio = this.targetView.width() / this.targetView.height();
    this.camera = new THREE.PerspectiveCamera( 75, ratio, 0.1, 1000 );
    this.camera.position.set(5,7,10);
    this.camera.lookAt(new THREE.Vector3(0,0,0));


    // Grid helper
    var size = 10;
    var step = 1;
    var gridHelper = new THREE.GridHelper( size, step );
    this.scene.add( gridHelper );

    // Orbit
    var controls = new THREE.OrbitControls(this.camera, this.targetView.get(0) ); // jQuery 객체를 일반 DOM 객체로 변환
    controls.damping = 0.2;

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


        //-----------------------------
        // 빛 추가
        //-----------------------------
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 1, 3, 1 );
        self.scene.add( directionalLight );


        //-----------------------------
        //-----------------------------

        // Current Transformaion Matrix
        var CTM = new THREE.Matrix4();          // 현재 변환 행렬

        var geometry = new THREE.SphereGeometry(0.1, 100, 100);
        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        index = 0;
        material.color = colorStack[index++];
        CTMPivot = new THREE.Mesh(geometry, material);
        self.scene.add(CTMPivot);

        //-----------------------------
        // 현재 CTM 좌표 출력
        //-----------------------------
        //var geometry = new THREE.SphereGeometry(0.1, 100, 100);
        //var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        //var sphere = new THREE.Mesh(geometry, material);
        //self.scene.add(sphere);

        for(var i = 0; i < movedlist.length; i++) {
            var item = movedlist[i].toJSON();


            if( item.blockType == self.DRAWBOX) {
                drawBox( item, CTM, self.scene );
            }
            else if( item.blockType == self.TRANSLATE) {
                doTranslate(item, CTM, self.scene );
            }
            else if( item.blockType == self.IDENTITYMATRIX) {
                idMatrix(CTM, self.scene );
            }

        }


    })
    /* END OF EVENT */



}




function drawBox(item, CTM, scene) {
    // Pivot (중심점) 생성
    var pivot = new THREE.Object3D();        // rotate의 중심점
    pivot.applyMatrix(CTM); // Translate 변환 행렬 곱함  // 중심점은 CTM 적용


    // 지오메트리 생성
    var geometry = new THREE.BoxGeometry(item.data.size, item.data.size, item.data.size);
    var material = new THREE.MeshPhongMaterial( {
        ambient: 0x333333,
        color: 0xffffff,
        emissive : 0xF7FF69,
        specular: 0xffffff,
        shininess: 50
    } );
    var box = new THREE.Mesh(geometry, material);

    var localMatrix = new THREE.Matrix4().makeTranslation(item.data.x, item.data.y, item.data.z); // 지역 변환 행렬 translate
    box.applyMatrix(localMatrix);
    pivot.add(box);

    scene.add(pivot);
}



function doTranslate(item, CTM, scene) {

    var multipleMatrix = new THREE.Matrix4().makeTranslation(item.data.x, item.data.y, item.data.z);

    // CTM 좌표 옮김
    var geometry = new THREE.SphereGeometry(0.1, 100, 100);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    material.color = colorStack[index++];
    CTMPivot = new THREE.Mesh(geometry, material);
    CTMPivot.applyMatrix(CTM);
    CTMPivot.applyMatrix(multipleMatrix); // 기존 좌표 행렬 * 이동한 좌표 행렬
    scene.add(CTMPivot);


    CTM.multiply(multipleMatrix);       // CTM Update

}




function idMatrix(CTM, scene){
    // translate init
    CTM.identity();
    CTMPivot.position.set(0,0,0);

    scene.add(CTMPivot);
}