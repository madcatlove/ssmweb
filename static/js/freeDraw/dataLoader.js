/**
 * Created by Lee on 2015-02-06.
 */

$(document).ready( function() {
    $('button[data-loader="load"]').on('click', blockDataLoader);
    $('button[data-loader="save"]').on('click', blockDataSaver);
})

function blockDataLoader() {

    var $tableHead= $('#dataLoaderHead');
    var $tableBody = $('#dataLoaderBody');

    urlReq.get('/freedraw/slot', {}, function(result) {
        if( result.error ) {
            alert(' 에러가 발생하였습니다. ');
            console.log( result );
        }
        else {
            BootstrapDialog.show({
                title : ' Load Data ',
                message : function(dialog) {
                    var content = $tableHead.tmpl();
                    var contentBody = content.find('tbody');

                    // 내용물 추가
                    var blockData = result.data;
                    for(var i = 0; i < blockData.length; i++) {
                        var item = blockData[i];

                        var rowData = $tableBody.tmpl( item );

                        // 데이터가 없다면 수정.
                        if( !item.data ) {
                            rowData.find('td:eq(1)').attr('colspan', 2).html(' 데이터가 없습니다. ');
                            rowData.find('td:eq(2)').remove();
                            rowData.find('input').attr('disabled','disabled');
                        }

                        rowData.appendTo( contentBody );
                    }

                    return content;
                },

                buttons: [{
                    label: ' Close ',
                    cssClass: 'btn-warning',
                    action: function(dialog) {
                        dialog.close();
                    }
                }, {
                    label: ' Load ',
                    cssClass : 'btn-success',
                    action: function(dialog) {
                        var modalBody = dialog.getModalBody();
                        var selectedInput = modalBody.find('input:checked');

                        if( selectedInput.length == 0 ) {
                            alert(' 불러올 슬롯을 선택하셔야 합니다. ');
                            return;
                        }

                        window.location.href = '/freedraw/view/' + parseInt( selectedInput.val() );
                        return;
                    }
                }]
            })
        }
    })
}

function blockDataSaver() {
    var $tableHead= $('#dataLoaderHead');
    var $tableBody = $('#dataLoaderBody');

    urlReq.get('/freedraw/slot', {}, function(result) {
        if( result.error ) {
            alert(' 에러가 발생하였습니다. ');
            console.log( result );
        }
        else {
            BootstrapDialog.show({
                title : ' Save Data ',
                message : function(dialog) {
                    var content = $tableHead.tmpl();
                    var contentBody = content.find('tbody');

                    // 내용물 추가
                    var blockData = result.data;
                    for(var i = 0; i < blockData.length; i++) {
                        var item = blockData[i];

                        var rowData = $tableBody.tmpl( item );

                        rowData.appendTo( contentBody );
                    }

                    return content;
                },

                buttons: [{
                    label: ' Close ',
                    cssClass: 'btn-warning',
                    action: function(dialog) {
                        dialog.close();
                    }
                }, {
                    label: ' Save ',
                    cssClass : 'btn-success',
                    action: function(dialog) {
                        var modalBody = dialog.getModalBody();
                        var selectedInput = modalBody.find('input:checked');

                        if( selectedInput.length == 0  ) {
                            alert(' 저장할 슬롯을 선택하셔야 합니다. ');
                            return;
                        }

                        if( arrStackList.length == 0 ) {
                            alert(' 저장할 데이터가 없습니다. ');
                            return;
                        }

                        var slotSeq = selectedInput.val();
                        var strData = JSON.stringify( arrStackList );
                        var sParam = {
                            slotSeq : slotSeq,
                            data : strData
                        }

                        // 저장 시작.
                        saveRequest( sParam, function(result) {
                            if( !result.error ) {
                                alert(' 저장되었습니다. ');
                                dialog.close();
                            }
                            else {
                                alert(' 저장에 실패하였습니다. ');
                                return;
                            }
                        })
                    }
                }]
            })
        }
    })
}


function saveRequest(sParam, resultCallback) {
    urlReq.put('/freedraw/slot/' + sParam.slotSeq, sParam, function(result) {
        resultCallback( result );
    })
}