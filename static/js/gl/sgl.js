
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

/**
 * DOM 에 Renderer 추가.
 */
sGL.prototype.insertDOM = function() {
    this.targetView.append( this.renderer.domElement );
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
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;

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