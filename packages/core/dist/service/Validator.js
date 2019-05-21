"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
class Validator {
    constructor() {
        this.validator = joi;
    }
    validate(entity, value, constraintAccessor, context) {
        let schema = null;
        if (entity.getConstraints) {
            context = constraintAccessor;
            constraintAccessor = entity;
        }
        if (typeof constraintAccessor === "function") {
            schema = constraintAccessor(this.validator, context);
        }
        else {
            schema = constraintAccessor.getConstraints(this.validator, context);
        }
        const result = this.validator.validate(value, schema);
        if (result.error) {
            return {
                success: false,
                message: result.error.message,
                original: result.error
            };
        }
        return {
            success: true,
            message: null,
            original: null
        };
    }
}
exports.default = Validator;
//# sourceMappingURL=Validator.js.map