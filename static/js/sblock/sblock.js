/**
 블락 구성요소
 */

function sBlock( seq ) {
    this.blockSeq = seq;
    this.blockType = -1;
    this.blockQuery =  null;
    this.blockInfo = null;
}


/**
 * 블럭의 블럭 타입을 결정함.
 * @param _blockType
 */
sBlock.prototype.setBlockType = function( _blockType) {
    this.blockType = _blockType;

    return this;
}

sBlock.prototype.initBlock = function() {
    if( this.blockType == -1 ) return false;
    this.blockInfo = getBlockInfo( this.blockType );

    return this;
}


sBlock.prototype.toHTML = function() {

    var blockName = this.blockInfo.blockName; // 블럭의 이름.
    var numBlockParam = this.blockInfo.numParam; // 블럭 파라메타 갯수
    var paramName = this.blockInfo.paramName; // 블럭 파라메타의 이름.

    var s =  $('<div class="blockitem" data-blockseq="'+ this.blockSeq +'" />');

    s.append( blockName + "<br />");
    for( var i = 0; i < numBlockParam; i++) {
        if( i != 0 && i % 2 == 0 ) s.append("<br />");
        s.append( paramName[i] + ' : ' + '<input type="text" data-paramname="'+ paramName[i] +'" style="width:15px;" /> ');
    }
    this.blockQuery = s;

    return this.blockQuery;
}


sBlock.prototype.toJSON = function() {
    var o = {};

    o.blockName = this.blockInfo.blockName;
    o.blockType = this.blockInfo.blockType;
    o.numParam = this.blockInfo.numParam;
    o.data = {};

   // console.log( $('input', this.blockQuery) );

    $('input', this.blockQuery).each( function() {
        var paramVal = $(this).val();
        var paramName = $(this).attr('data-paramname');
        o.data[paramName] = paramVal;
    })


    //console.log( o );


    return o;
}


/**
 * 블락 인포메이션 가져옴.
 * @param blockType
 */
var getBlockInfo = (function() {

    var blockNameList = [
        '', 'Begin', 'End',
        'Vertex2', 'Vertex3',
        'DrawCircle', 'DrawBox', 'DrawSphere',
        'PushMatrix', 'PopMatrix',
        'Translate', 'Rotate', 'Scale',
        'Perspective', 'Othographic', 'lookAt',
        'DirectionalLight', 'SpotLight',
        'cameraPosition', 'LightPosition',
        'IdentityMatrix',
    ];

    /** 블락  정보 리스트 생성 */
    var blockInfo = [];

    // 0 번째 버림.
    blockInfo.push({});

    // 리스트 생성시작 (-_-;;)  ( 블락타입, 블락이름, 파라메터갯수 , 파라메터정보(이름) )
    blockInfo.push( createBlockInfo( 1, blockNameList[1], 0, []));
    blockInfo.push( createBlockInfo( 2, blockNameList[2], 0, []));
    blockInfo.push( createBlockInfo( 3, blockNameList[3], 2, ['x','y']));
    blockInfo.push( createBlockInfo( 4, blockNameList[4], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 5, blockNameList[5], 3, ['x','y','r']));
    blockInfo.push( createBlockInfo( 6, blockNameList[6], 4, ['size','x','y','z']));
    blockInfo.push( createBlockInfo( 7, blockNameList[7], 3, ['R', 'Lo', 'La']));
    blockInfo.push( createBlockInfo( 8, blockNameList[8], 0, []));
    blockInfo.push( createBlockInfo( 9, blockNameList[9], 0, []));
    blockInfo.push( createBlockInfo( 10, blockNameList[10], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 11, blockNameList[11], 4, ['t', 'x','y','z']));
    blockInfo.push( createBlockInfo( 12, blockNameList[12], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 13, blockNameList[13], 4, ['fov', 'aspect', 'near', 'far']));
    blockInfo.push( createBlockInfo( 14, blockNameList[14], 6, ['left','right','top','bottom','near','far']));
    blockInfo.push( createBlockInfo( 15, blockNameList[15], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 16, blockNameList[16], 2, ['hex','intensity']));
    blockInfo.push( createBlockInfo( 17, blockNameList[17], 4, ['hex','intensity','distance','angle']));
    blockInfo.push( createBlockInfo( 18, blockNameList[18], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 19, blockNameList[19], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 20, blockNameList[20], 0, []) );

    return function(blockType) {
        for( var i = 1; blockInfo.length; i++) {
            if( blockInfo[i].blockType == blockType ) {
                return blockInfo[i];
            }
        }

        // 리턴할게 없을경우.
        return {};
    }
})();

function createBlockInfo( blockType, blockName, numParams, paramName) {

    return {
        blockType : blockType,
        blockName : blockName,
        numParam : numParams,
        paramName : paramName,
    }

}