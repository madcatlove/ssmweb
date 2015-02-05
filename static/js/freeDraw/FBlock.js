
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
}

/**
 * 블락 객체를 HTML (jQuery Object) 로 리턴.
 * @returns {null|*}
 */
FBlock.prototype.toHTML = function() {
    var $blockDiv = $('<div />')
        .attr('data-blockSeq', this.seqNum)
        .addClass('blockitem');
    this.blockQuery = $blockDiv;


    // 파라메타 추가
    $blockDiv.append( this.blockName );
    for( var i = 0; i < this.blockParam.length; i++) {
        var hiInput = $('<input />')
            .attr('type','hidden')
            .attr('data-paramname', this.blockParam[i]);
        $blockDiv.append( hiInput );
    }

    var btn = $('<button />')
        .attr('data-blockbutton', true)
        .html('Edit');
    $blockDiv.append(btn);


    this.buttonEvent(btn);

    return this.blockQuery;
}


/**
 * jQuery Target Object 에 블락 추가
 * @param $jqTarget
 */
FBlock.prototype.appendHTML = function( $jqTarget ) {
    $jqTarget.append( this.toHTML() );
}


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
    })

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
}

/**
 * 모달창에서 받은 값을 히든폼에 업데이트.
 * @param container
 */
FBlock.prototype.updateHiddenForm = function( container ) {
    var input = $('input', container);
    var hiddenInput = $('input[type=hidden]', this.blockQuery);
    var hiddenInputObj = {};

    // 히든 인풋 생성.
    hiddenInput.each( function() {
        var currentInput = $(this);
        hiddenInputObj[ currentInput.attr('data-paramname') ] = currentInput;
    })

    // 컨테이너 인풋값으로 업데이트.
    input.each( function() {
        var currentInput = $(this);
        var hInput = hiddenInputObj[ currentInput.attr('data-paramname') ];
        hInput.val( currentInput.val() );
    })

}

/**
 * 에딧 버튼 작동 여부 설정
 * @param b( boolean )
 */
FBlock.prototype.setButtonListen = function( b ) {
    this.blockQuery.find('button').eq(0).attr('data-blockbutton', b);
}

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
                        self.updateHiddenForm(container);
                        self.getProcessingCode();
                        dialog.close();
                    }
                }
            ] /* end button */
        })
    }

}

/**
 * 현재 블락의 정보를 프로세싱 코드로 리턴.
 */
FBlock.prototype.getProcessingCode = function() {

    console.log( this.toJSON() );

}






//--------------------------------------------
//-------------- 블럭 타입 정의 ---------------
//--------------------------------------------
FBlock.TYPE = {};
FBlock.TYPE.DRAWLINE = createFBlockInfo('DrawLine', 1, 'x1,y1,z1,x2,y2,z2', 'float,float,float,float,float,float', null);
FBlock.TYPE.DRAWBOX = createFBlockInfo('DrawBox', 2, 'width,height,depth', 'float,float,float', null);
FBlock.TYPE.DRAWSPHERE = createFBlockInfo('DrawSphere', 3, 'radius,ures,vres','float,int,int', null);
FBlock.TYPE.PUSHMATRIX = createFBlockInfo('PushMatrix', 4, [], [], null);
FBlock.TYPE.POPMATRIX = createFBlockInfo('PopMatrix', 5, [], [], null);
FBlock.TYPE.IDENTITYMATRIX = createFBlockInfo('IdentityMatrix', 6, [], [], null);
FBlock.TYPE.TRANSLATE = createFBlockInfo('Translate', 7, 'x,y,z', 'float,float,float', null);
FBlock.TYPE.ROTATE = createFBlockInfo('Rotate', 8, 'theta,x,y,z', 'float,float,float,float', null);
FBlock.TYPE.SCALE = createFBlockInfo('Scale', 9, 'x,y,z', 'float,float,float', null);
FBlock.TYPE.PERSPECTIVE = createFBlockInfo('Perspective', 10,'fov,aspect,near,far', 'float,float,float,float', null);
FBlock.TYPE.ORTHOGRAPHIC = createFBlockInfo('Orthographic', 11, 'left,right,bottom,top,near,far', 'float,float,float,float,float,float', null);
FBlock.TYPE.LOOKAT = createFBlockInfo('LookAt', 12, 'eyeX,eyeY,eyeZ,centerX,centerY,centerZ,upX,upY,upZ', 'float,float,float,float,float,float,float,float,float', null);
FBlock.TYPE.DIRECTIONALLIGHT = createFBlockInfo('DirectionalLight', 13, 'RGB,intensity,nx,ny,nz', 'hex,float,float,float,float', null);
FBlock.TYPE.SPOTLIGHT = createFBlockInfo('SpotLight', 14, 'RGB,intensity,x,y,z,nx,ny,nz,angle,exponent', 'hex,float,float,float,float,float,float', null);
FBlock.TYPE.COLOR = createFBlockInfo('Color', 15, 'RGB', 'hex,', null);

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

    return {
        blockName : blockName, // 블락 이름 ( 뷰에 보여짐 )
        blockType : blockType, // 블락 종류 ( 시퀀스 번호 )
        paramName : paramName, // 파라메터 이름
        paramType : paramVariableType, // 파라메터 타입
        extraInfo : extraInfo
    }
}


var processingMapper = function( item ) {

    var str = '';
    var data = item.data;
    switch( item.blockType ) {
        case 1 :
            str = sFormat('line(?,?,?,?,?,?);', [data.x1, -data.y1, data.z1, data.x2, -data.y2, data.z2]);
            break;
        case 2 :
            str = sFormat('box(?,?,?);', [data.width, data.height, data.depth]);
            break;
        case 3 :
            str = sFormat('sphere(?);', [data.radius]);
            str += sFormat('sphereDetail(?,?);', [data.ures, data.vres]);
            break;
        case 4 :
            str = sFormat('pushMatrix();');
            break;
        case 5 :
            str = sFormat('popMatrix();');
            break;
        case 6 :
            str = sFormat('resetMatrix();');
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
            str = sFormat('perspective(?,?,?,?);', [data.fov, data.aspect, data.near, data.far]);
            break;
        case 11 :
            str = sFormat('ortho(?,?,?,?,?,?);',[data.left, data.right, data.bottom, data.top, data.near, data.far]);
            break;
        case 12 :
            str = sFormat('cameara(?,?,?,?,?,?,?,?,?);', [data.eyeX, -data.eyeY, data.eyeZ,
                data.centerX, -data.centerY, data.centerZ, data.upX, -data.upY, data.upZ]);
            break;
        case 13 :
            str = sFormat('directionalLight(?,?,?,?,?,?);', [(data.RGB & 0xFF0000) >> 4 , (data.RGB & 0x00FF00) >> 2,
            data.RGB & 0x0000FF, data.nx, -data.ny, data.nz]);
            break;
        case 14 :
            str = sFormat('spotLight(?,?,?,?,?,?,?,?,?,?,?);', [ (data.RGB & 0xFF0000) >> 4 , (data.RGB & 0x00FF00) >> 2,
                data.RGB & 0x0000FF , data.x, -data.y, data.z, data.nx, -data.ny, data.nz, data.angle, data.exponent]);
            break;
        case 15 :
            str = sFormat('color(?,?,?);',[(data.RGB & 0xFF0000) >> 4 , (data.RGB & 0x00FF00) >> 2, data.RGB & 0x0000FF]);
            break;
    }


    /* 스트링 변환 */
    function sFormat(_str, dataArr) {
        for(var i = 0; i < dataArr.length; i++) {
            _str = _str.replace('?', dataArr[i]);
        }
        return _str;
    }


    return str;
}