import * as joi from "joi";
import Validable, { ConstraintBuilderFunction } from "./Validable";
declare class Validator {
    validator: joi.Root;
    constructor();
    validate(entity: Validable, value: any, constraintAccessor: ConstraintBuilderFunction | Validable | any, context?: any): {
        success: boolean;
        message: string | null;
        original: joi.Err | null;
    };
}
export default Validator;
