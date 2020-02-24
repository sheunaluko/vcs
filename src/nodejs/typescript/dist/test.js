"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entities/entity");
//import * as res from "./entities/resources/index"
function logit(msg) {
    console.log(msg);
}
exports.logit = logit;
exports.tests = {
    "1": function () {
        var e = new entity_1.Entity({ entity_id: "test_entity" });
        e.describe();
    }
};
//# sourceMappingURL=test.js.map