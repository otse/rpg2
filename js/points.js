export var points;
(function (points) {
    function add(a, b) {
        return [a[0] + b[0], a[1] + b[1]];
    }
    points.add = add;
})(points || (points = {}));
export default points;
