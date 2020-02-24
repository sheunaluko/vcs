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
const entity = __importStar(require("../entity"));
const t = __importStar(require("../types"));
class Resource extends entity.Entity {
    constructor(ops) {
        super(ops);
        this.type = t.c.resource;
        this.type_handlers = ops.type_handlers || {};
    }
    supported_types() {
        return new Set(Object.keys(this.type_handlers));
    }
    as(tp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.d("Request to resolve resource to type: " + tp);
            let fn = this.type_handlers[tp];
            this.log.d("Available type handler keys! ");
            this.log.d(Object.keys(this.type_handlers));
            if (fn) {
                try {
                    var result = yield (fn.bind(this))();
                    //here we should actually coerce the type 
                    //in case the provided function failed 
                    switch (tp) {
                        case t.c.string:
                            this.log.d("Want string");
                            if (!(result.constructor == String)) {
                                this.log.d("Coercing to string");
                                result = String(result);
                            }
                            break;
                        case t.c.float:
                            this.log.d("Want float");
                            //console.log(result.constructor) 
                            //process.debug = result 
                            if (!(result.constructor == Number)) {
                                this.log.d("Coercing to float");
                                result = Number(result);
                            }
                            else {
                                this.log.d("Not coercing: ");
                                this.log.d(`Because Type of result = ${t.js_type(result)}`);
                            }
                            break;
                        case t.c.array:
                            this.log.d("Want array");
                            if (!(result.constructor == Array)) {
                                this.log.d("Coercing to Array");
                                result = [result];
                            }
                            break;
                        default:
                            this.log.d("Want unknown");
                            this.log.d("Not performing any type conversions");
                            break;
                    }
                    //this.log.d("Got result as: ") 	     
                    this.log.d("Suppressing result (entities > resource.js)");
                    //this.log.d(result) 
                    this.log.d(`Type of result = ${t.js_type(result)}`);
                    return result;
                }
                catch (e) {
                    this.catch_error(e);
                    throw (e);
                }
            }
            else {
                throw ("Unavailable type!");
            }
        });
    }
}
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map