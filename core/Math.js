/**
 * Created by joom on 2015-01-26.
 */

var math = {

    distance2f : function (p1, p2) {
        return Math.sqrt(
            Math.pow((p2[0] - p1[0]), 2) +
            Math.pow((p2[1] - p1[1]), 2)
        );
    },

    distance3f : function (p1, p2) {
        return Math.sqrt(
            Math.pow((p2[0] - p1[0]), 2) +
            Math.pow((p2[1] - p1[1]), 2) +
            Math.pow((p2[2] - p1[2]), 2)
        );
    },

    //area2f : function (p1)

    normal3f : function (p1, p2, p3) {
        var v1 = [
            p1[0] - p2[0],
            p1[1] - p2[1],
            p2[2] - p2[2]
        ];

        var v2 = [
            p2[0] - p3[0],
            p2[1] - p3[1],
            p2[2] - p3[2]
        ];

        var out = [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];

        console.log('out[0] = ' + out[0] + ' out[1] = ' + out[1] + ' out[2] = ' + out[2]);
        return out;
    }




};

module.exports = math;