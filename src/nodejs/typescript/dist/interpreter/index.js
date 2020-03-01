"use strict";
//Fri Jul 26 18:36:38 PDT 2019
//modified for ts Sun Mar  1 11:59:31 PST 2020 
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ir = __importStar(require("./deps/interpreter_rules"));
const it = __importStar(require("./deps/interpreter_targets"));
const iu = __importStar(require("./deps/interpreter_utils"));
/**
 * Parse a text string
 *
 * @param {string} text
 * @returns
 */
function parse(text) {
    return ir.handle_text(text);
}
module.exports = {
    parse,
    it,
    ir,
    iu,
};
//# sourceMappingURL=index.js.map