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

    /* 블락 뼈대 */
    var s =  $('<div class="blockitem" data-blockseq="'+ this.blockSeq +'" />');
    var button = $('<button class="btn btn-xs btn-info"><span class="glyphicon glyphicon-wrench"></span></button>');


    /* 블락 내용 추가 */
    s.append( blockName + "<br />");
    for( var i = 0; i < numBlockParam; i++) {
        s.append( paramName[i] + ',')
         .append( $('<input type="hidden" class="input" value="0" data-paramname="'+ paramName[i] + '" />') );
    }

    /* 클릭시 모달창 띄움 */
    if( numBlockParam != 0 ) {
        s.append(button);
        $('button', s).click(function (e) {
            createModalWindowForBlock(paramName, numBlockParam, s);
        });
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
        'IdentityMatrix', 'LightDirection',
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
    blockInfo.push( createBlockInfo( 17, blockNameList[17], 4, ['hex','intensity','angle','exp']));
    blockInfo.push( createBlockInfo( 18, blockNameList[18], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 19, blockNameList[19], 3, ['x','y','z']));
    blockInfo.push( createBlockInfo( 20, blockNameList[20], 0, []) );
    blockInfo.push( createBlockInfo( 21, blockNameList[21], 3, ['x','y','z']));

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

/**
 * 튜토리얼 블락을 수정하기위한 모달창 생성 함수
 * @param param
 * @param paramSize
 * @param $blockObj
 */
function createModalWindowForBlock( param, paramSize, $blockObj ) {

    var container = $('<div />');
    var hiddenFormValue = {};

    // 블락 Obj 에서 값 추출해옴 ( 폼값 유지를 위함 )
    var hiddenFormInput = $('input', $blockObj);
    for( var i = 0; i < hiddenFormInput.length; i++) {
        var item = hiddenFormInput.eq(i);
        hiddenFormValue[ item.attr('data-paramname') ] = item.val();
    }


    // 파라메터 갯수만큼 돌면서 폼 컨트롤 생성.
    for( var i = 0; i < paramSize; i++) {
        var parameterName = param[i].toUpperCase();

        var formGroup = $('<div class="form-group" />');
            formGroup.append('<label> Parameter For ' + parameterName + ' </label>');
        var formInput = $('<input />').addClass('form-control').attr('data-paramname', param[i]);
            formInput.val( hiddenFormValue[ param[i] ] );
        formGroup.append( formInput );

        container.append( formGroup );
    }

    BootstrapDialog.show({
        type : BootstrapDialog.TYPE_INFO,
        title : ' Modify Parameters ',
        message : container,
        buttons: [
            {
                label: 'Close',
                cssClass: 'btn-danger',
                action: function (dialog) {
                    dialog.close();
                }
            },
            {
                label: 'Confirm',
                cssClass: 'btn-warning',
                action: function (dialog) {
                    updateHiddenForm($blockObj, container);
                    updateBlockObjTitle($blockObj);
                    dialog.close();
                }
            }
        ] /* end button */
    })

}

/**
 * Tooltip 타이틀 업데이트를 위한 함수.
 * @param $blockObj
 * @param $modalForm
 */
function updateHiddenForm( $blockObj, $modalForm ) {
    var modalFormValue = {};
    var modalInput = $( 'input', $modalForm );
    var blockHiddenInput = $( 'input', $blockObj );

    // 모달폼에서 생성된 값 받아옴.
    for(var i = 0; i < modalInput.length; i++) {
        var item = modalInput.eq(i);
        modalFormValue[ item.attr('data-paramname') ] = item.val() || 0;
    }

    // block 오브젝트에 있는 인풋들 업데이트.
    for(var i = 0; i < blockHiddenInput.length; i++) {
        var item = blockHiddenInput.eq(i);
        item.val( modalFormValue[ item.attr('data-paramname') ] );
    }

}

function updateBlockObjTitle( $blockObj ) {

    var blockHiddenInput = $('input', $blockObj );
    var stitle = [];

    // 타이틀 업데이트를 위해 블락 input 정보를 긁어옴.
    for(var i = 0; i < blockHiddenInput.length; i++) {
        var item = blockHiddenInput.eq(i);
        stitle.push( item.attr('data-paramname').toUpperCase() + ' : ' + item.val() );
    }

    var strStitle = stitle.join("\n");


    // 툴팁 다시 계산.
    $blockObj.attr('title', strStitle)
                .attr('data-placement', 'right')
                .tooltip('fixTitle')
                .tooltip('hide');

}