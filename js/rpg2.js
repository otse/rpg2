import points from "./points.js";
var rpg2;
(function (rpg2) {
    function boot() {
        console.log('<- rpg2 setting up ->');
        points;
    }
    rpg2.boot = boot;
})(rpg2 || (rpg2 = {}));
(function () {
    console.log('iife');
})();
export default rpg2;
