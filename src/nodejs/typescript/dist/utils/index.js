"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = __importStar(require("./logger"));
/**
 * Returns a logger instance
 *
 * @export
 * @param {string} name
 * @returns
 */
function get_logger(name) {
    return logger.make_logger(name);
}
exports.get_logger = get_logger;
function string_contains_any(val, arr) {
    let ret = false;
    for (let i of arr) {
        var res = (val.indexOf(i) > -1);
        ret = ret || res;
    }
    if (ret) {
        return true;
    }
    else {
        return false;
    }
}
let arithmetic_ops = ['+', '-', '/', '*'];
/**
 * Checks if a string has any arithmetic operations in it
 *
 * @export
 * @param {*} text
 * @returns {Boolean}
 */
function has_arithmetic(text) {
    return string_contains_any(text, arithmetic_ops);
}
exports.has_arithmetic = has_arithmetic;
/**
 * Unsafe nodejs evaluation
 *
 * @export
 * @param {string} text
 * @returns {*}
 */
function _eval(text) {
    return eval(text);
}
exports._eval = _eval;
//# sourceMappingURL=index.js.map