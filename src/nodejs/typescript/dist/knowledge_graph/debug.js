"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const kg = __importStar(require("./index"));
exports.main = {
    "1": function () {
        var G = new kg.Graph({});
        let rel = {
            source: "dog",
            target: "animal",
            edge: "is",
        };
        G.add_relation(rel);
        return G;
    }
};
//# sourceMappingURL=debug.js.map