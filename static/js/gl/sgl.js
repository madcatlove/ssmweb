
function sGL( $targetView) {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.targetView = $targetView;

}

/**
 * scene,camera,renderer 순서로 초기화
 * @returns {sGL}
 */
sGL.prototype.initAll = function() {
    this.initScene().initCamera().initRenderer();
    return this;
}

/**
 * WebGL 렌더러 초기화.
 * @returns {sGL}
 */
sGL.prototype.initRenderer = function() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.targetView.width() , this.targetView.height() );
    return this;
}

sGL.prototype.reconstruct = function() {
    this.initAll().insertDOM();
    return this;
}


/**
 * DOM 에 Renderer 추가.
 */
sGL.prototype.insertDOM = function() {
    this.targetView.html( this.renderer.domElement );
    return this;
}

/**
 * Scene 초기화.
 * @returns {sGL}
 */
sGL.prototype.initScene = function() {
    this.scene = new THREE.Scene();

    return this;
}

/**
 * Camera 초기화
 * @returns {sGL}
 */
sGL.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera(75, this.targetView.width()/this.targetView.height() , 0.1, 1000);
    this.camera.position.z = 5;

    return this;
}

/**
 * 렌더링 시작
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

/**
 * 가짜 런..
 */
sGL.prototype.run = function() {

}


/**var blockNameList = [
 '', 'Begin', 'End',
 'Vertex2', 'Vertex3',
 'DrawCircle', 'DrawBox', 'DrawSphere',
 'PushMatrix', 'PopMatrix',
 'Translate', 'Rotate', 'Scale',
 'Perspective', 'Othographic', 'lookAt',
 'DirectionalLight', 'SpotLight',
 'cameraPosition', 'LightPosition',
 ];*/
/* STATIC VARIABLE */
sGL.prototype.BEGIN             = 1;
sGL.prototype.END               = 2;
sGL.prototype.VERTEX2           = 3;
sGL.prototype.VERTEX3           = 4;
sGL.prototype.DRAWCIRCLE        = 5;
sGL.prototype.DRAWBOX           = 6;
sGL.prototype.DRAWSPHERE        = 7;
sGL.prototype.PUSHMATRIX        = 8;
sGL.prototype.POPMATRIX         = 9;
sGL.prototype.TRANSLATE         = 10;
sGL.prototype.ROTATE            = 11;
sGL.prototype.SCALE             = 12;
sGL.prototype.PERSPECTIVE       = 13;
sGL.prototype.OTHOGRAPHIC       = 14;
sGL.prototype.LOOKAT            = 15;
sGL.prototype.DIRECTIONALLIGHT  = 16;
sGL.prototype.SPOTLIGHT         = 17;
sGL.prototype.CAMERAPOSITION    = 18;
sGL.prototype.LIGHTPOSITION     = 19;
sGL.prototype.IDENTITYMATRIX    = 20;
sGL.prototype.LIGHTDIRECTION    = 21;