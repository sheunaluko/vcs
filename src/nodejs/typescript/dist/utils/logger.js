"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(id) {
        this.id = id;
    }
    i(...args) {
        let tmp = `[${this.id}]:: ` + args.join(" ");
        console.log(tmp);
    }
    d(...args) {
        let tmp = `[${this.id}]:: ` + args.join(" ");
        console.log(tmp);
    }
}
exports.Logger = Logger;
function make_logger(id) {
    return new Logger(id);
}
exports.make_logger = make_logger;
//# sourceMappingURL=logger.js.map