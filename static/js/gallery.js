/**
 * Created by Lee on 2015-02-08.
 */

function galleryLoader(page) {
    urlReq.get('/gallery/info', {page : page || 1}, function(result) {
        console.log( result.data );
    })
}