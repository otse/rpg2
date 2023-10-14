import hooks from "./hooks.js";
import points from "./points.js";
import rpg2 from "./rpg2.js";
var app;
(function (app) {
    let KEY;
    (function (KEY) {
        KEY[KEY["UNPRESSED"] = 0] = "UNPRESSED";
        KEY[KEY["PRESSED"] = 1] = "PRESSED";
        KEY[KEY["REPEAT_DELAY"] = 2] = "REPEAT_DELAY";
        KEY[KEY["REPEAT"] = 3] = "REPEAT";
        KEY[KEY["RELEASED"] = 4] = "RELEASED";
    })(KEY = app.KEY || (app.KEY = {}));
    let MB;
    (function (MB) {
        MB[MB["UP"] = -1] = "UP";
        MB[MB["OFF"] = 0] = "OFF";
        MB[MB["DOWN"] = 1] = "DOWN";
        MB[MB["STILL"] = 2] = "STILL";
    })(MB = app.MB || (app.MB = {}));
    const keys = {};
    const mb = {};
    var pos = [0, 0];
    app.mobile = false;
    app.wheel = 0;
    function onkeys(event) {
        const key = event.key.toLowerCase();
        if ('keydown' == event.type)
            keys[key] = keys[key]
                ? KEY.REPEAT : KEY.PRESSED;
        else if ('keyup' == event.type)
            keys[key] = KEY.RELEASED;
        if (event.keyCode == 114)
            event.preventDefault();
    }
    app.onkeys = onkeys;
    function prompt_key(k) {
        return keys[k] || KEY.UNPRESSED;
    }
    app.prompt_key = prompt_key;
    function boot(version) {
        console.log('app boot');
        hooks.call('AppBoot', null);
        rpg2.boot();
        app.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        function onmousemove(e) {
            pos[0] = e.clientX;
            pos[1] = e.clientY;
        }
        function onmousedown(e) {
            mb[e.button] = 1;
            if (e.button == 1)
                return false;
        }
        function onmouseup(e) {
            mb[e.button] = MB.UP;
        }
        function onwheel(e) {
            app.wheel = e.deltaY < 0 ? 1 : -1;
        }
        let touchStart = [0, 0];
        function ontouchstart(e) {
            //message("ontouchstart");
            touchStart = [e.pageX, e.pageY];
            pos[0] = e.pageX;
            pos[1] = e.pageY;
            mb[2] = MB.UP;
        }
        function ontouchmove(e) {
            pos[0] = e.pageX;
            pos[1] = e.pageY;
            if (!mb[0])
                mb[0] = KEY.PRESSED;
            e.preventDefault();
            return false;
        }
        function ontouchend(e) {
            const touchEnd = [e.pageX, e.pageY];
            mb[0] = MB.UP;
            mb[2] = MB.UP;
            if (points.equals(touchEnd, touchStart) /*&& buttons[2] != MOUSE.STILL*/) {
                mb[2] = MB.DOWN;
            } /*
            else if (!pts.equals(touchEnd, touchStart)) {
                buttons[2] = MOUSE.UP;
            }
            //message("ontouchend");*/
            //return false;
        }
        function onerror(message) {
            document.querySelectorAll('.stats')[0].innerHTML = message;
        }
        if (app.mobile) {
            document.ontouchstart = ontouchstart;
            document.ontouchmove = ontouchmove;
            document.ontouchend = ontouchend;
        }
        else {
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
        }
        window.onerror = onerror;
        loop(0);
    }
    app.boot = boot;
    function post_keys() {
        for (let i in keys) {
            if (keys[i] == KEY.PRESSED)
                keys[i] = KEY.REPEAT_DELAY;
            else if (keys[i] == KEY.RELEASED)
                keys[i] = KEY.UNPRESSED;
        }
    }
    function post_mouse_buttons() {
        for (let b of [0, 1, 2])
            if (mb[b] == MB.DOWN)
                mb[b] = MB.STILL;
            else if (mb[b] == MB.UP)
                mb[b] = MB.OFF;
    }
    function loop(timestamp) {
        requestAnimationFrame(loop);
        rpg2.loop();
        app.wheel = 0;
        post_keys();
        post_mouse_buttons();
    }
    app.loop = loop;
    function set_innerhtml(selector, html) {
        let element = document.querySelectorAll(selector)[0];
        element.innerHTML = html;
    }
    app.set_innerhtml = set_innerhtml;
})(app || (app = {}));
window['App'] = app;
export default app;
