"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const res = __importStar(require("./resource"));
const t = __importStar(require("../types"));
class Result extends res.Resource {
    constructor(ops) {
        let entity_id = "result_resource";
        if (!ops.entity_id) {
            ops.entity_id = entity_id;
        }
        super(ops);
        this.value = ops.value;
        //now we determine what the type of the value is, and we set the type handler 
        let tp = t.js_type(ops.value);
        this.type_handlers[tp] = function () {
            return __awaiter(this, void 0, void 0, function* () { return ops.value; });
        };
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map