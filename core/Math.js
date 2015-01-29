/**
 * Created by joom on 2015-01-26.
 */

var math = {

    isEqualStartPoint2f : function (p) {

        for (var i = 0 ; i < p.length - 1 ; i ++) {
            if (p[i].x != p[i+1].x || p[i].x != p[i+1].x || p[i].x != p[i+1].x) {
                return false;
            }
        }

        return true;
    },

    /**
     * 점들의 위치가 같은지 같지 않은지 판별
     * @param p
     * @returns {boolean}
     */
    isEqualFloat : function (p) {
        for (var i = 0 ; i < p.length ; i ++) {
            if (p[i][0] != p[i][1]) {
                return false;
            }
        }

        return true;
    },

    /**
     * 두개의 노멀벡터간의 차를 구하여 0 인지 확인
     * @param n1
     * @param n2
     * @returns {boolean}
     */
    isSumOfNormalZero : function (n1, n2) {
        return n1.x - n2.x == 0 &&
                n1.y - n2.y == 0 &&
                n1.z - n2.z == 0;
    },

    /**
     * 2차원에서 두점 사이의 길이
     * @param p
     * @returns {number}
     */
    distance2f : function (p) {
        return Math.sqrt(
            Math.pow((p[1].data.x - p[0].data.x), 2) +
            Math.pow((p[1].data.y - p[0].data.y), 2)
        );
    },

    /**
     * 3차원에서 두점 사이의 길이
     * @param p
     * @returns {number}
     */
    distance3f : function (p) {
        return Math.sqrt(
            Math.pow((p[1][0] - p[0][0]), 2) +
            Math.pow((p[1][1] - p[0][1]), 2) +
            Math.pow((p[1][2] - p[0][2]), 2)
        );
    },

    /**
     * 2차원에서 다각형의 면의 넓이
     * @param p
     * @returns {number}
     */
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

    /**
     * 3차원에서 한 면에서의 노멀벡터
     * @param p
     * @returns {{x: number, y: number, z: number}}
     */
    normal3f : function (p) {
        var v1 = [
            p[0].x - p[1].x,
            p[0].y - p[1].y,
            p[0].z - p[1].z
        ];

        var v2 = [
            p[1].x - p[2].x,
            p[1].y - p[2].y,
            p[1].z - p[2].z
        ];

        var out = {
            x: v1[1] * v2[2] - v1[2] * v2[1],
            y: v1[2] * v2[0] - v1[0] * v2[2],
            z: v1[0] * v2[1] - v1[1] * v2[0]
        };

        return out;
    }

};

module.exports = math;