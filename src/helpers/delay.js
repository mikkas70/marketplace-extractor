"use strict";
exports.__esModule = true;
var delay = function (milliseconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, milliseconds);
    });
};
exports["default"] = delay;
