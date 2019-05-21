import { Root, SchemaLike } from "joi";
export declare type ConstraintBuilder = Root;
export declare type Constraint = SchemaLike;
export declare type ConstraintBuilderFunction = (builder: ConstraintBuilder, context?: object) => Constraint;
interface Validable {
    getConstraints: ConstraintBuilderFunction;
}
export default Validable;
