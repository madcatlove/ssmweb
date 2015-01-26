/**
 * Created by joom on 2015-01-26.
 */

var math = {

    distance2f : function (p) {
        return Math.sqrt(
            Math.pow((p[1][0] - p[0][0]), 2) +
            Math.pow((p[1][1] - p[0][1]), 2)
        );
    },

    distance3f : function (p) {
        return Math.sqrt(
            Math.pow((p[1][0] - p[0][0]), 2) +
            Math.pow((p[1][1] - p[0][1]), 2) +
            Math.pow((p[1][2] - p[0][2]), 2)
        );
    },

    area2f : function (p) {
        var res = 0;

        for (var i = 0 ; i < p.length  ; i ++) {
            if (i == p.length - 1) {
                res += p[i][0] * p[0][1];
                res -= p[0][0] * p[i][1];
            } else {
                res += p[i][0] * p[i + 1][1];
                res -= p[i + 1][0] * p[i][1];
            }
        }
        res /= 2;
        console.log('area2f = ' + res);

        return res;
    },

    normal3f : function (p) {
        var v1 = [
            p[0][0] - p[1][0],
            p[0][1] - p[1][1],
            p[0][2] - p[1][2]
        ];

        var v2 = [
            p[1][0] - p[2][0],
            p[1][1] - p[2][1],
            p[1][2] - p[2][2]
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