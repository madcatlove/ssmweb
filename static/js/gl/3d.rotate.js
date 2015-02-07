/**
 * Created by Lee on 2015-01-29.
 */



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


//----------------------
// GLOBAL VARIABLES
//----------------------
var _PIVOT , _CTM_PIVOT;
var _COLOR = new Array();
var _INDEX = 0;

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

        //-----------------------------
        // 현재 CTM 좌표 출력
        //-----------------------------
        //var geometry = new THREE.SphereGeometry(0.1, 100, 100);
        //var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        //var sphere = new THREE.Mesh(geometry, material);
        //self.scene.add(sphere);


        var rotateInfo = {
            theta : 0,
            rX : 0,
            rY : 0,
            rZ : 0,
            rotateChecker : false
        }
        _COLOR.push(new THREE.Color(0xffffff));
        _COLOR.push(new THREE.Color(0xff0000));
        _COLOR.push(new THREE.Color(0x00ff00));
        _COLOR.push(new THREE.Color(0x00ffff));

        //------- PIVOT , CTM_PIVOT 설정 -------
        _PIVOT = new THREE.Object3D();
        var geometry = new THREE.SphereGeometry(0.1,100,100);
        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
       // material.color = _COLOR[_INDEX++];
        _CTM_PIVOT = new THREE.Mesh(geometry, material);
        _PIVOT.add( _CTM_PIVOT );
        self.scene.add( _PIVOT );



        //----------- 블럭 조합 시작 ------------------
        for(var i = 0; i < movedlist.length; i++) {
            var item = movedlist[i].toJSON();


            if( item.blockType == self.DRAWBOX) {
                drawBox( item, CTM, self.scene, rotateInfo );
            }
            else if( item.blockType == self.TRANSLATE) {
                doTranslate(item, CTM, self.scene, rotateInfo );
            }
            else if( item.blockType == self.IDENTITYMATRIX) {
                idMatrix(CTM, self.scene, rotateInfo );
            }
            else if( item.blockType == self.ROTATE ) {
                doRotate( rotateInfo, item );
            }

        }

    })
    /* END OF EVENT */



}




function drawBox(item, CTM, scene, rotateInfo) {

    var geometry = new THREE.BoxGeometry( item.data.size,  item.data.size,  item.data.size );
    var material = new THREE.MeshPhongMaterial( {
        ambient: 0x333333,
        color: 0xffffff,
        emissive : 0xF7FF69,
        specular: 0xffffff,
        shininess: 50
    } );

    var cube = new THREE.Mesh( geometry, material );
    var localMatrix = new THREE.Matrix4().makeTranslation( item.data.x, item.data.y, item.data.z); // 지역 변환 행렬 translate

    if( rotateInfo.rotateChecker ) {
        cube.applyMatrix(localMatrix);
        _CTM_PIVOT.add(cube);
    }
    else {
        cube.applyMatrix(CTM);
        cube.applyMatrix(localMatrix);
        scene.add(cube);
    }
}



function doTranslate(item, CTM, scene, rotateInfo) {
    var multipleMatrix = new THREE.Matrix4().makeTranslation( item.data.x , item.data.y , item.data.z);

    //pivot update
    if( rotateInfo.rotateChecker){
        _CTM_PIVOT.applyMatrix(multipleMatrix);
        scene.add( _PIVOT );
    }
    else{
        _PIVOT.applyMatrix(multipleMatrix);
        scene.add( _PIVOT );
    }

    // CTM Update
    CTM.multiply(multipleMatrix);

}



function idMatrix(CTM, scene, rotateInfo) {
    // translate init
    CTM.identity();

    //rotate init
    rotateInfo.rotateChecker = false;
    rotateInfo.theta = 0;
    rotateInfo.rX = 0;
    rotateInfo.rY = 0;
    rotateInfo.rZ = 0;
    //_PIVOT.removeChildAtIndex(0);
    //var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    //var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    //_CTM_PIVOT = new THREE.Mesh(geometry, material);
    //_PIVOT.add(_CTM_PIVOT);
    //_PIVOT.position.set(0, 0, 0);
    //------- PIVOT , CTM_PIVOT 설정 -------
    _PIVOT = new THREE.Object3D();
    var geometry = new THREE.SphereGeometry(0.1,100,100);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
 //   material.color = _COLOR[_INDEX++];
    _CTM_PIVOT = new THREE.Mesh(geometry, material);
    _PIVOT.add( _CTM_PIVOT );
    scene.add( _PIVOT );
}

function doRotate(rotateInfo, item) {

    rotateInfo.rotateChecker = true;
    var theta   = rotateInfo.theta = item.data.t;
    var rX      = rotateInfo.rX = item.data.x;
    var rY      = rotateInfo.rY = item.data.y;
    var rZ      = rotateInfo.rZ = item.data.z;

    _PIVOT.rotation.x = -theta*rX*Math.PI/180;
    _PIVOT.rotation.y = -theta*rY*Math.PI/180;
    _PIVOT.rotation.z = -theta*rZ*Math.PI/180;
}