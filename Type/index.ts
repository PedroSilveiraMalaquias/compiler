import { KindEnum } from '../Semantic/KindEnum';
import { ALIAS, ARRAY, BlockElement, Field, STRUCT, Type } from '../Semantic/tokenClasses';
import { universalScalar } from './ScalarTypes';

export class TypeHelper {
	constructor() {}

	static checkTypes(type1: BlockElement, type2: BlockElement) {
		if ((!type1 && type2) || (!type2 && type1)) return false;
		if (type1 === type2) {
			return true;
		} else if (type1 === universalScalar || type2 === universalScalar) {
			return true;
		} else if (type1.kind === KindEnum.UNIVERSAL || type2.kind === KindEnum.UNIVERSAL) {
			return true;
		} else if (type1.kind === KindEnum.ALIAS_TYPE && type2.kind !== KindEnum.ALIAS_TYPE) {
			const baseType = (type1.obj as ALIAS).baseType;
			if (!baseType) return false;
			return TypeHelper.checkTypes(baseType, type2);
		} else if (type1.kind !== KindEnum.ALIAS_TYPE && type2.kind === KindEnum.ALIAS_TYPE) {
			const baseType = (type2.obj as ALIAS).baseType;
			if (!baseType) return false;
			return TypeHelper.checkTypes(type1, baseType);
		} else if (type1.kind === type2.kind) {
			if (type1.kind === KindEnum.ALIAS_TYPE) {
				const baseType1 = (type1.obj as ALIAS).baseType;
				const baseType2 = (type2.obj as ALIAS).baseType;
				if (!baseType1 || !baseType2) return false;
				return TypeHelper.checkTypes(baseType1, baseType2);
			} else if (type1.kind === KindEnum.ARRAY_TYPE) {
				const arrayType1 = type1.obj as ARRAY;
				const arrayType2 = type2.obj as ARRAY;
				if (!arrayType1 || !arrayType2 || !arrayType1.elemType || !arrayType2.elemType)
					return false;
				if (arrayType1.numElems === arrayType2.numElems) {
					return TypeHelper.checkTypes(arrayType1.elemType, arrayType2.elemType);
				} else return false;
			} else if (type1.kind === KindEnum.STRUCT_TYPE) {
				let f1 = (type1.obj as STRUCT).fields;
				let f2 = (type2.obj as STRUCT).fields;
				while (f1 !== null && f2 !== null) {
					if (!f1?.type || !f2?.type) return false;
					if (!TypeHelper.checkTypes(f1.type, f2.type)) {
						return false;
					}

					f1 = f1.type.next as Field;
					f2 = f2.type.next as Field;
				}
				return f1 === null && f2 === null;
			}
		} else {
			return false;
		}
	}
}
