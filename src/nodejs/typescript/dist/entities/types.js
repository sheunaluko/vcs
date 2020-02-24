"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const param_types = __importStar(require("./param_types"));
exports.p = param_types;
//define CORE types as enum 
var c;
(function (c) {
    c[c["string"] = 0] = "string";
    c[c["array"] = 1] = "array";
    c[c["dictionary"] = 2] = "dictionary";
    c[c["float"] = 3] = "float";
    c[c["resource"] = 4] = "resource";
    c[c["operation"] = 5] = "operation";
    c[c["action"] = 6] = "action";
    c[c["argument"] = 7] = "argument";
    c[c["result"] = 8] = "result";
})(c = exports.c || (exports.c = {}));
function js_type(x) {
    switch (x.constructor) {
        case String:
            return c.string;
            break;
        case Array:
            return c.array;
            break;
        case Object:
            return c.dictionary;
            break;
        case Number:
            return c.float;
            break;
    }
    return null;
}
exports.js_type = js_type;
//# sourceMappingURL=types.js.map