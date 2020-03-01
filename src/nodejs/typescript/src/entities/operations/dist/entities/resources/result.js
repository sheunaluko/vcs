"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const res = __importStar(require("./resource"));
const types = __importStar(require("../types"));
class Result extends res.Resource {
    constructor(ops) {
        let entity_id = "result_resource";
        if (!ops.entity_id) {
            ops.entity_id = entity_id;
        }
        super(ops);
        this.value = ops.value;
        //now we determine what the type of the value is, and we set the type handler 
        let tp = types.js_type(ops.value);
        this.type_handlers[tp] = function () { return ops.value; };
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map