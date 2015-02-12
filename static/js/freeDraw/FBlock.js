
/**
 * 블락 객체 생성
 * @param bType
 * @param seqNum
 * @constructor
 */
function FBlock( bType, seqNum ) {
    this.blockType = bType.blockType; // 블록 타입
    this.blockName = bType.blockName; // 블록의 이름
    this.blockParam = bType.paramName; // 퍄라메터 리스트
    this.blockParamType = bType.paramType; // 파라메터 타입
    this.blockExtraInfo = bType.extraInfo; // 추가정보
    this.seqNum = seqNum;
    this.blockQuery = null; // 블락이 생성된 jquery 객체.
    this.bType = bType;
    this.isShortMode = false; // 그냥 렌더링용인지
}

/**
 * 블락 객체를 HTML (jQuery Object) 로 리턴.
 * @returns {null|*}
 */
FBlock.prototype.toHTML = function() {
    var $blockDiv = $('<div />')
        .attr('data-blockSeq', this.seqNum)
        .addClass('blockitem')
        .css('display', 'inline-block');
    this.blockQuery = $blockDiv;



    // 이미지 추가
    var parent = $('#blocklist').parent();
    var parentWidth = parent.width() * 0.9,
        parentHeight = parent.height();
    var imageRatio = 153.0 / 549.0;
    var editImageRatio = 128.0 / 153.0;

    $blockDiv.css({
        width: parentWidth+'px'
    });
    var imageInfo = this.blockExtraInfo.image;
    var blockImageWrapper = $('<div />')
        .css({
            'position' : 'relative',
            'display' : 'inline-block',
            'z-index' : 2,
            'width' : parentWidth + 'px',
            'height' : (parentWidth * imageRatio) + 'px'
        });

    var blockImage = $('<img />')
        .attr('src', '/static/images/freeblocks/' + imageInfo.image)
        .attr('alt', this.blockName)
        .css({
            'max-width' : '100%',
            'max-height' : '100%'
        });

    blockImageWrapper.append( blockImage );

    $blockDiv.append( blockImageWrapper );


    // 에디트 이미지가 존재한다면
    var editImage;
    if( imageInfo.edit ) {
        var editImageWrapper = $('<div />').css({
            'position' : 'absolute',
            right : 0,
            top : 0,
            'z-index' : 3,
            'height' : blockImageWrapper.height() + 'px',
            'width' : (blockImageWrapper.height() * editImageRatio) + 'px'
        });
        editImage = $('<img />')
            .attr('src', '/static/images/freeblocks/' + imageInfo.edit)
            .attr('alt', this.blockName + 'edit')
            .css({
                'max-width' : '100%',
                'max-height' : '100%'
            });
        editImageWrapper.append(editImage);
        $blockDiv.append( editImageWrapper );
    }


    // 파라메타 추가
    for( var i = 0; i < this.blockParam.length; i++) {
        var hiInput = $('<input />')
            .attr('type','hidden')
            .attr('data-paramname', this.blockParam[i])
            .val('0');
        $blockDiv.append( hiInput );
    }

    // 버튼 이벤트 추가.
    if( imageInfo.edit ) {
        editImage.attr('data-blockbutton',true);
        this.buttonEvent( editImage );
    }

    return this.blockQuery;
};


/**
 * 뷰어용 HTML 파일 생성.
 */
FBlock.prototype.toShortHTML = function() {
    var $blockDiv = $('<div />')
        .attr('data-blockSeq', this.seqNum)
        .addClass('blockitem')
        .css('display', 'inline-block');
    this.blockQuery = $blockDiv;

    var parent = $('#stacklist'),
        parentWidth = parent.width();
    var imageInfo = this.blockExtraInfo.image;
    var blockImageWrapper = $('<div />')
        .css({
            'position' : 'relative',
            'display' : 'inline-block',
            'z-index' : 2,
            //'width' : parentWidth + 'px',
            // 'height' : (parentWidth * imageRatio) + 'px'
        });

    var blockImage = $('<img />')
        .attr('src', '/static/images/freeblocks/short/' + imageInfo.image)
        .attr('alt', this.blockName)
        .css({
            'max-width' : '100%',
            'max-height' : '100%'
        });

    blockImageWrapper.append( blockImage );
    $blockDiv.append( blockImageWrapper );

    // 파라메타 추가
    for( var i = 0; i < this.blockParam.length; i++) {
        var hiInput = $('<input />')
            .attr('type','hidden')
            .attr('data-paramname', this.blockParam[i])
            .val('0');
        $blockDiv.append( hiInput );
    }

    return this.blockQuery;
}


/**
 * jQuery Target Object 에 블락 추가
 * @param $jqTarget
 */
FBlock.prototype.appendHTML = function( $jqTarget ) {
    $jqTarget.append( this.toHTML() );
};


/**
 * 현재 블락 정보 객체 리턴
 * @returns {{}}
 */
FBlock.prototype.toJSON = function() {
    var data = {};
    var valueList = [];

    // 데이터 긁어옴.
    $('input', this.blockQuery).each( function(idx) {
        valueList.push( $(this).val() );
    });

    // 매핑.
    for(var i = 0; i < this.blockParam.length; i++) {
        var paramName = this.blockParam[i].toLowerCase();
        data[ paramName ] = valueList[i];
    }

    return {
        blockType : this.blockType,
        blockName : this.blockName,
        blockParam : this.blockParam,
        data : data
    }
};

/**
 * 모달창에서 받은 값을 히든폼에 업데이트.
 * @param container
 * @return true/false
 */
FBlock.prototype.updateHiddenForm = function( container ) {
    var input = $('input', container);
    var hiddenInput = $('input[type=hidden]', this.blockQuery);
    var hiddenInputObj = {};
    var returnValue = true;

    // 파라메타 타입 객체 생성.
    var paramType = {};
    for(var i = 0; i < this.bType.paramName.length; i++) {
        paramType[ this.bType.paramName[i] ] = this.bType.paramType[i];
    }

    // 히든 인풋 생성.
    hiddenInput.each( function() {
        var currentInput = $(this);
        hiddenInputObj[ currentInput.attr('data-paramname') ] = currentInput;
    });

    // 컨테이너 인풋값으로 업데이트.
    input.each( function() {
        var currentInput = $(this),
            currentValue = currentInput.val(),
            hParamName = currentInput.attr('data-paramname');
        var hInput = hiddenInputObj[ hParamName ];

        // 유효성 검사.
        if( paramType[hParamName] == 'float' ) {
            if( isNaN( parseFloat(currentValue ) ) ) {
                returnValue = false;
                return false;
            }

            //if( /([^0-9\.\-])+/g.test(currentValue) )  {
            //    returnValue = false;
            //    return false;
            //}

            var floatRegex = /^[+-]?\d+(\.?\d*)$/i;
            if( !floatRegex.test( currentValue ) ) {
                return false;
            }

        }
        else if( paramType[hParamName] == 'hex') {
            if( isNaN( Number( currentValue) ) ) {
                returnValue = false;
                return false;
            }

            if( Number(currentValue) < 0) {
                returnValue = false;
                return false;
            }

            if( !(/^0x[0-9a-f]{2}[0-9a-f]{2}[0-9a-f]{2}$/gi.test(currentValue)) ) {
                returnValue = false;
                return false;
            }
        }

        hInput.val( currentValue );


    })

    return returnValue;
};

/**
 * 에딧 버튼 작동 여부 설정
 * @param b( boolean )
 */
FBlock.prototype.setButtonListen = function( b ) {
    var button = this.blockQuery.find('img[data-blockbutton]').eq(0).attr('data-blockbutton', b);
    if( b ) {
        button.hover(function() {
            $(this).css({
                'cursor' : 'pointer'
            })
        })
    }
};

/**
 * 버튼 이벤트 리스너 등록
 * @param $btn
 * @param execFunc
 */
FBlock.prototype.buttonEvent = function($btn, execFunc) {

    var self = this;

    $btn.click( function() {
        if( $(this).attr('data-blockbutton') == 'true' ) {
            createModifyModalWindow.apply(self); // Scope 조정
        }
    })

    var $blockObj = this.blockQuery;

    function createModifyModalWindow() {
        var self = this;
        var container = $('<div />');
        var hiddenFormValue = {};

        // 블락 Obj 에서 값 추출해옴 ( 폼값 유지를 위함 )
        var hiddenFormInput = $('input', $blockObj);
        for( var i = 0; i < hiddenFormInput.length; i++) {
            var item = hiddenFormInput.eq(i);
            hiddenFormValue[ item.attr('data-paramname') ] = item.val();
        }


        // 파라메터 갯수만큼 돌면서 폼 컨트롤 생성.
        for( var i = 0; i < this.blockParam.length; i++) {
            var parameterName = this.blockParam[i].toUpperCase();

            var formGroup = $('<div class="form-group" />');
            formGroup.append('<label> Parameter For ' + parameterName + ' </label>');
            var formInput = $('<input />').addClass('form-control').attr('data-paramname', this.blockParam[i]);

            // 파라메터 종류가 RGB 이면 칼라피커 추가.
            if( this.blockParam[i] === 'rgb' ) {
                formInput.colorpicker({
                    format : 'hex'
                });
                formInput.prop('readonly','readonly');
            }

            formInput.val( hiddenFormValue[  this.blockParam[i] ] );
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
                        var r = self.updateHiddenForm(container);
                        if( !r ) {
                            alert(' 잘못된 값이 입력되었습니다. ');
                            return;
                        }
                        $(document).trigger('blockModified'); // 블락 수정 이벤트 보냄.
                        self.updateTooltipInfo();
                        dialog.close();
                    }
                }
            ] /* end button */
        })
    }

}


/**
 * 툴팁 정보 초기화.
 */
FBlock.prototype.initTooltipInfo = function() {
    var blockHiddenInput = $('input[type=hidden]', this.blockQuery );
    var stitle = [];

    // 타이틀 업데이트를 위해 블락 input 정보를 긁어옴.
    for(var i = 0; i < blockHiddenInput.length; i++) {
        var item = blockHiddenInput.eq(i);
        stitle.push( item.attr('data-paramname').toUpperCase() + ' : ' + item.val() );
    }

    var strStitle = stitle.join("\n");


    // 툴팁 시작
    this.blockQuery.attr('title', strStitle)
        .tooltip({
            placement : 'left',
            container : 'body'
        });

    return this;
}

/**
 * 블락 툴팁 업데이트
 */
FBlock.prototype.updateTooltipInfo = function() {

    var blockHiddenInput = $('input[type=hidden]', this.blockQuery );
    var stitle = [];

    // 타이틀 업데이트를 위해 블락 input 정보를 긁어옴.
    for(var i = 0; i < blockHiddenInput.length; i++) {
        var item = blockHiddenInput.eq(i);
        stitle.push( item.attr('data-paramname').toUpperCase() + ' : ' + item.val() );
    }

    var strStitle = stitle.join("\n");


    // 툴팁 다시 계산.
    this.blockQuery.attr('title', strStitle)
        .attr('data-placement', 'right')
        .tooltip('fixTitle')
        .tooltip('hide');

    return this;
}

/**
 * 현재 블락의 정보를 프로세싱 코드로 리턴.
 */
FBlock.prototype.getProcessingCode = function() {
    var t = processingMapper( this.toJSON() );
    console.log( ' getProcessingCode ' , t );
    return t;
}

FBlock.prototype.injectData = function( data ) {
    var hiddenInput = $('input[type=hidden]', this.blockQuery);
    var inputObjectManager = {};

    for( var i = 0; i < hiddenInput.length; i++) {
        var input = hiddenInput.eq(i);
        inputObjectManager[ input.attr('data-paramname').toLowerCase() ] = input;
    }

    // 데이터 주입 시작.
    for( var dataKey in data ) {
        var input = inputObjectManager[ dataKey ];
        input.val( data[dataKey] );
    }

    return this;
}






//--------------------------------------------
//-------------- 블럭 타입 정의 ---------------
//--------------------------------------------
var extraInfo = {};
FBlock.TYPE = {};

extraInfo = {
    image : {
        image : 'draw/drawLine.png',
        edit : 'draw/edit.png'
    }
}
FBlock.TYPE.DRAWLINE = createFBlockInfo('DrawLine', 1, 'x1,y1,z1,x2,y2,z2', 'float,float,float,float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'draw/drawBox.png',
        edit : 'draw/edit.png'
    }
}
FBlock.TYPE.DRAWBOX = createFBlockInfo('DrawBox', 2, 'width,height,depth', 'float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'draw/drawSphere.png',
        edit : 'draw/edit.png'
    }
}
FBlock.TYPE.DRAWSPHERE = createFBlockInfo('DrawSphere', 3, 'radius,ures,vres','float,int,int', extraInfo);

extraInfo = {
    image : {
        image : 'matrix/pushMatrix.png',
        edit : null
    }
}
FBlock.TYPE.PUSHMATRIX = createFBlockInfo('PushMatrix', 4, [], [], extraInfo);

extraInfo = {
    image : {
        image : 'matrix/popMatrix.png',
        edit : null
    }
}
FBlock.TYPE.POPMATRIX = createFBlockInfo('PopMatrix', 5, [], [], extraInfo);

extraInfo = {
    image : {
        image : 'matrix/identityMatrix.png',
        edit : null
    }
}
FBlock.TYPE.IDENTITYMATRIX = createFBlockInfo('IdentityMatrix', 6, [], [], extraInfo);

extraInfo = {
    image : {
        image : 'trans/translate.png',
        edit : 'trans/edit.png'
    }
}
FBlock.TYPE.TRANSLATE = createFBlockInfo('Translate', 7, 'x,y,z', 'float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'trans/rotate.png',
        edit : 'trans/edit.png'
    }
}
FBlock.TYPE.ROTATE = createFBlockInfo('Rotate', 8, 'theta,x,y,z', 'float,float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'trans/scale.png',
        edit : 'trans/edit.png'
    }
}
FBlock.TYPE.SCALE = createFBlockInfo('Scale', 9, 'x,y,z', 'float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'camera/perspective.png',
        edit : 'camera/edit.png'
    }
}
FBlock.TYPE.PERSPECTIVE = createFBlockInfo('Perspective', 10,'fov,near,far', 'float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'camera/orthogonal.png',
        edit : 'camera/edit.png'
    }
}
FBlock.TYPE.ORTHOGRAPHIC = createFBlockInfo('Orthographic', 11, 'left,right,bottom,top,near,far', 'float,float,float,float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'camera/lookAt.png',
        edit : 'camera/edit.png'
    }
}
FBlock.TYPE.LOOKAT = createFBlockInfo('LookAt', 12, 'eyeX,eyeY,eyeZ,centerX,centerY,centerZ,upX,upY,upZ', 'float,float,float,float,float,float,float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'light/directionalLight.png',
        edit : 'light/edit.png'
    }
}
FBlock.TYPE.DIRECTIONALLIGHT = createFBlockInfo('DirectionalLight', 13, 'RGB,nx,ny,nz', 'hex,float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'light/spotLight.png',
        edit : 'light/edit.png'
    }
}
FBlock.TYPE.SPOTLIGHT = createFBlockInfo('SpotLight', 14, 'RGB,intensity,x,y,z,nx,ny,nz,angle,exponent', 'hex,float,float,float,float,float,float', extraInfo);

extraInfo = {
    image : {
        image : 'color/color.png',
        edit : 'color/edit.png'
    }
}
FBlock.TYPE.COLOR = createFBlockInfo('Color', 15, 'RGB', 'hex,', extraInfo);

/**
 * 블락 요소들을 객체로 리턴.
 * @param blockName
 * @param blockType
 * @param paramName
 * @param paramVariableType
 * @param extraInfo
 * @returns {{blockName: *, blockType: *, paramName: *, paramType: *}}
 */
function createFBlockInfo( blockName, blockType , paramName, paramVariableType, extraInfo) {

    if( 'string' === typeof paramName ) {
        paramName = paramName.split(',');
    }

    if( 'string' === typeof paramVariableType ) {
        paramVariableType = paramVariableType.split(',');
    }

    // 소문자로 전환.
    for(var i = 0; i < paramName.length; i++) {
        if( typeof paramName[i] === 'string') {
            paramName[i] = paramName[i].toLowerCase();
        }
    }

    for(var i = 0; i < paramVariableType.length; i++) {
        if( typeof paramVariableType[i] === 'string') {
            paramVariableType[i] = paramVariableType[i].toLowerCase();
        }
    }



    return {
        blockName : blockName, // 블락 이름 ( 뷰에 보여짐 )
        blockType : blockType, // 블락 종류 ( 시퀀스 번호 )
        paramName : paramName, // 파라메터 이름
        paramType : paramVariableType, // 파라메터 타입
        extraInfo : extraInfo
    }
}



//-----------------------------------
// PROCESSING 함수와 매핑
//-----------------------------------
var processingMapper = function( item ) {

    var str = '';
    var data = item.data;
    switch( item.blockType ) {
        case 1 :
            str = sFormat('drawLine(?,?,?,?,?,?);', [data.x1, data.y1, data.z1, data.x2, data.y2, data.z2]);
            break;
        case 2 :
            str = sFormat('box(?,?,?);', [data.width, data.height, data.depth]);
            break;
        case 3 :
            str = sFormat('sphereDetail(?,?);', [data.ures, data.vres]);
            str += sFormat('sphere(?);', [data.radius]);
            break;
        case 4 :
            str = sFormat('pushMatrix();');
            break;
        case 5 :
            str = sFormat('popMatrix();');
            break;
        case 6 :
            //str = sFormat('resetMatrix();');
            //str += sFormat('translate(width/2, height/2, 0);');
            str = sFormat('popMatrix();');
            str += sFormat('pushMatrix();');
            break;
        case 7 :
            str = sFormat('translate(?,?,?);', [data.x, -data.y, data.z]);
            break;
        case 8 :
           str = sFormat('rotate(?,?,?,?);', [data.theta, data.x, -data.y, data.z]);
            break;
        case 9 :
            str = sFormat('scale(?,?,?);', [data.x, -data.y, data.z]);
            break;
        case 10 :
            str  = 'autoCamera = false;';
            str += sFormat('perspective(PI/180.0* ?,width/height,?,?);', [data.fov, data.near, data.far]);
            //  perspective(PI/3.0, width/height, cameraZ/10.0, cameraZ*10.0) where cameraZ is ((height/2.0) / tan(PI*60.0/360.0));.
            break;
        case 11 :
            str  = 'autoCamera = false;';
            str += sFormat('ortho(?,?,?,?,-1000 + ?,1000 + ?);',[data.left, data.right, data.bottom, data.top, data.near, data.far]);
            // ortho(0, width, 0, height, -10, 10).
            break;
        case 12 :
            str  = 'autoCamera = false;';
            str += sFormat('camera(width/2.0 + ?, height/2.0 + ?,?, width/2.0 + ?, height/2.0 + ?,?,?,?,?);', [-data.eyex, data.eyey, -data.eyez, data.centerx, data.centery,data.centerz, data.upx, data.upy, data.upz]);
            //  str += sFormat('camera(width/2.0+500, height/2.0+500, 300, width/2.0, height/2.0, 0, 0, 1, 0);');
            // /camera(width/2.0, height/2.0, (height/2.0) / tan(PI*60.0 / 360.0), width/2.0, height/2.0, 0, 0, 1, 0);
            break;
        case 13 :
            str += sFormat('lightFalloff(1.0, 0.0, 0.0);', [data.intensity]);
            str = sFormat('directionalLight(?,?,?,?,?,?);', [(data.rgb & 0xFF0000) >> 16 , (data.rgb & 0x00FF00) >> 8,
            data.rgb & 0x0000FF, data.nx, -data.ny, data.nz]);

            break;
        case 14 :
            str = sFormat('lightFalloff((0.1+?), 0.0, 0.0);', [data.intensity]);
            str += sFormat('spotLight(?,?,?,?,?,?,?,?,?,?,?);', [ (data.rgb & 0xFF0000) >> 16 , (data.rgb & 0x00FF00) >> 8,
                data.rgb & 0x0000FF , data.x, -data.y, data.z, data.nx, -data.ny, data.nz, data.angle, data.exponent]);

            break;
        case 15 :
            str = sFormat('fill(?,?,?);',[(data.rgb & 0xFF0000) >> 16 , (data.rgb & 0x00FF00) >> 8, data.rgb & 0x0000FF]);
            break;
    }


    /* 스트링 변환 */
    function sFormat(_str, dataArr) {
        if( !dataArr ) return _str;

        for(var i = 0; i < dataArr.length; i++) {
            _str = _str.replace('?', dataArr[i]);
        }
        return _str;
    }



    return str;
}