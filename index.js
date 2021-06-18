(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('vue')) :
    typeof define === 'function' && define.amd ? define(['vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vue));
}(this, (function (vue) { 'use strict';

    var p = {
        install: function (app, options) {
            console.log(app);
        }
    };
    var app = vue.createApp({
        render: function () {
            return vue.h('div');
        }
    });
    app.use(p);

})));
