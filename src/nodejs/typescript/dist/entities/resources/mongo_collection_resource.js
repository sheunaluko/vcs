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
Object.defineProperty(exports, "__esModule", { value: true });
class MongoCollectionResource extends Resource {
    constructor(ops) {
        if (!ops.id) {
            throw ("Need collection id");
        }
        if (!ops.query) {
            ops.query = {};
        }
        //define params 
        var collection_id = ops.id;
        var query = ops.query;
        var entity_id = `MongoCollectionResource::${collection_id}`;
        // - init object 
        super({ entity_id });
        //set the member vars 
        this.query = query;
        this.collection_id = collection_id;
        //define the type handlers 
        this.type_handlers = {};
        this.type_handlers[types.array] = this.as_array;
        //define default type 
        this.default_type = types.array;
    }
    as_array() {
        return __awaiter(this, void 0, void 0, function* () {
            let coll = this.collection_id;
            let query = this.query;
            return yield vcs.db.get_collection({ coll, query });
        });
    }
}
module.exports = {
    MongoCollectionResource
};
//# sourceMappingURL=mongo_collection_resource.js.map