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
    var blockType = this.blockInfo.blockType;

    var imageInfo = imageMapper( blockType );

    /* 블락 뼈대 */
    var s =  $('<div class="blockitem" data-blockseq="'+ this.blockSeq +'" />').attr('data-isstacked', '0');
    s.css({
        'display' : 'inline-block'
    })
    var button = $('<button class="btn btn-xs btn-info"><span class="glyphicon glyphicon-wrench"></span></button>');

    var parentWidth = $('#blocklist').width();
    var blockImageRatio = 101.0/359;
    var blockEditImageRatio = 84 / 101;

    /* 블락 내용 추가 */
    //s.append( blockName + "<br />");
    var blockImage = $('<div />').css({
        position: 'relative',
        display: 'inline-block',
        width : parentWidth + 'px',
        height : ( parentWidth * blockImageRatio) + 'px'
    });

    blockImage.append( $('<img />').attr('src', imageInfo.image).css({
        'max-width' : '100%',
        'max-height' : '100%'
    }) );
    s.append( blockImage );

    /* 에디트 이미지 위치 */
    var editImage = $('<div />').css({
        position: 'absolute',
        right : 0,
        top : 0,
        height : blockImage.height() +'px',
        width : (blockImage.height() * blockEditImageRatio) + 'px'
    })
    editImage.append( $('<img />').attr({
        src : imageInfo.edit
    }).css({
        'max-width' : '100%',
        'max-height' : '100%'
    }));


    /* 히든 인풋 추가 */
    for( var i = 0; i < numBlockParam; i++) {
        s.append( $('<input type="hidden" class="input" value="0" data-paramname="'+ paramName[i] + '" />') );
    }

    /* 클릭시 모달창 띄움 */
    if( numBlockParam != 0 ) {
        blockImage.append( editImage );

        $('img', editImage).hover(function() {
            $(this).css('cursor','pointer');
        })
        $('img', editImage).click(function (e) {
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
    blockInfo.push( createBlockInfo( 1, blockNameList[1], 0, [])); // BEGIN
    blockInfo.push( createBlockInfo( 2, blockNameList[2], 0, [])); // END
    blockInfo.push( createBlockInfo( 3, blockNameList[3], 2, ['x','y'])); // VERTEX2
    blockInfo.push( createBlockInfo( 4, blockNameList[4], 3, ['x','y','z'])); // VERTEX3
    blockInfo.push( createBlockInfo( 5, blockNameList[5], 3, ['x','y','r'])); // DRAWCIRCLE
    blockInfo.push( createBlockInfo( 6, blockNameList[6], 4, ['size','x','y','z'])); // DRAWBOX
    blockInfo.push( createBlockInfo( 7, blockNameList[7], 3, ['R', 'Lo', 'La'])); // DRAWSPHERE
    blockInfo.push( createBlockInfo( 8, blockNameList[8], 0, [])); // PUSH MATRIX
    blockInfo.push( createBlockInfo( 9, blockNameList[9], 0, [])); // POP MATRIX
    blockInfo.push( createBlockInfo( 10, blockNameList[10], 3, ['x','y','z'])); // TRANSLATE
    blockInfo.push( createBlockInfo( 11, blockNameList[11], 4, ['t', 'x','y','z'])); // ROTATE
    blockInfo.push( createBlockInfo( 12, blockNameList[12], 3, ['x','y','z'])); // SCALE
    blockInfo.push( createBlockInfo( 13, blockNameList[13], 3, ['fov', 'near', 'far'])); //PERSPECTIVE
    blockInfo.push( createBlockInfo( 14, blockNameList[14], 6, ['left','right','bottom','top','near','far'])); // ORTHOGRAPHIC
    blockInfo.push( createBlockInfo( 15, blockNameList[15], 3, ['x','y','z'])); // LOOKAT
    blockInfo.push( createBlockInfo( 16, blockNameList[16], 1, ['hex'])); // DIRECTIONAL LIGHT
    blockInfo.push( createBlockInfo( 17, blockNameList[17], 4, ['hex','intensity','angle','exp'])); // SPOT LIGHT
    blockInfo.push( createBlockInfo( 18, blockNameList[18], 3, ['x','y','z'])); // CAMERA POSITION
    blockInfo.push( createBlockInfo( 19, blockNameList[19], 3, ['x','y','z'])); // LIGHT POSITION
    blockInfo.push( createBlockInfo( 20, blockNameList[20], 0, []) ); // IDENTITY MATRIX
    blockInfo.push( createBlockInfo( 21, blockNameList[21], 3, ['x','y','z'])); // LIGHT DIRECTION

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


var imageMapper = (function() {
    var data = {};

    createImageObj(1, 'begin.png', 'e3.png');
    createImageObj(2, 'end.png', 'e3.png');

    createImageObj(3, 'v2.png', 'e1.png');
    createImageObj(4, 'v3.png', 'e1.png');

    createImageObj(5, 'begin.png', 'e3.png'); // 폐기

   createImageObj(6, 'drawbox.png', 'e2.png');
    createImageObj(7, 'drawsphere.png', 'e2.png');

    createImageObj(8, 'push.png', 'e4.png');
    createImageObj(9, 'pop.png', 'e4.png');

    createImageObj(10, 'tr.png', 'e5.png');
    createImageObj(11, 'rt.png', 'e5.png');
    createImageObj(12, 'sc.png', 'e5.png');

    createImageObj(13, 'pers.png', 'e6.png');
    createImageObj(14, 'ortho.png', 'e6.png');
    createImageObj(15, 'la.png', 'e6.png');

    createImageObj(16, 'dl.png', 'e7.png');
    createImageObj(17, 'sl.png', 'e7.png');

    createImageObj(18, 'cp.png', 'e8.png');
    createImageObj(19, 'lp.png', 'e8.png');
    createImageObj(20, 'id.png', 'e4.png');
    createImageObj(21, 'ld.png', 'e8.png');

    function createImageObj(blockSeq, imageName, editName) {
        var iUrl = '/static/images/blocks/';
        data[blockSeq] = {
            image : iUrl + imageName,
            edit : iUrl + editName
        }
    }

    return function( blockType ) {
        return data[ blockType ];
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

    var isstacked = $blockObj.attr('data-isstacked') || '0';
    if( isstacked == '1') {
        alert(' 스택 내에서는 값을 변경 할 수 없습니다. ');
        return;
    }


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

        // 칼라피커 활성화.
        if( param[i].toLowerCase() === 'hex') {
            formInput.colorpicker({
                format : 'hex'
            });
            //formInput.prop('readonly','readonly');
        }

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
                    var r = updateHiddenForm($blockObj, container);
                    if( !r  ) {
                        alert(' 잘못된 값이 입력되었습니다. ');
                        return;
                    }
                    updateBlockObjTitle($blockObj);
                    dialog.close();
                }
            }
        ] /* end button */
    })

}

/**
 * 히튼폼 업데이트
 * @param $blockObj
 * @param $modalForm
 */
function updateHiddenForm( $blockObj, $modalForm ) {
    var modalFormValue = {};
    var modalInput = $( 'input', $modalForm );
    var blockHiddenInput = $( 'input', $blockObj );

    // 모달폼에서 생성된 값 받아옴.
    for(var i = 0; i < modalInput.length; i++) {
        var item = modalInput.eq(i),
            hParamName = item.attr('data-paramname');


        //---- 유효성 검사 ----
        if( hParamName == 'hex') {
            var hVal = Number( item.val() );
            if( isNaN( hVal )) {
                return false;
            }
            else if( hVal < 0 ) {
                return false;
            }

            if( !(/^0x[0-9a-f]{2}[0-9a-f]{2}[0-9a-f]{2}$/gi.test( item.val() )) ) {
                return false;
            }

        }
        else {
            if( /^(R|Lo|La|intensity)$/i.test(hParamName) ) {
                if( parseFloat( item.val() ) < 0 ) {
                    return false;
                }
            }

            if( isNaN( parseFloat( item.val() ) ) ) {
                return false;
            }


            var floatRegex = /^[+-]?\d+(\.?\d*)$/i;
            if( !floatRegex.test( item.val() ) ) {
                return false;
            }

            //if( /([^0-9\.\-])+/g.test( item.val() ) )  {
            //    return false;
            //}
        }
        modalFormValue[ hParamName ] = item.val() || 0;
    }

    // block 오브젝트에 있는 인풋들 업데이트.
    for(var i = 0; i < blockHiddenInput.length; i++) {
        var item = blockHiddenInput.eq(i);
        item.val( modalFormValue[ item.attr('data-paramname') ] );
    }

    return true;
}

/**
 * 툴팁 타이틀 업데이트
 * @param $blockObj
 */
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