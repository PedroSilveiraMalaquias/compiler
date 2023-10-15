import { KindEnum } from '../Semantic/KindEnum';
import { BlockElement, Type } from '../Semantic/tokenClasses';

export enum ScalarTypes {
	INT = 'INT',
	CHAR = 'FLOAT',
	BOOL = 'BOOL',
	STRING = 'STRING',
	UNIVERSAL = 'UNIVERSAL',
}

export const intScalar = new BlockElement(-1, undefined, KindEnum.SCALAR_TYPE, new Type(null, 1));
export const charScalar = new BlockElement(-1, undefined, KindEnum.SCALAR_TYPE, new Type(null, 1));
export const boolScalar = new BlockElement(-1, undefined, KindEnum.SCALAR_TYPE, new Type(null, 1));
export const stringScalar = new BlockElement(
	-1,
	undefined,
	KindEnum.SCALAR_TYPE,
	new Type(null, 1),
);
export const universalScalar = new BlockElement(
	-1,
	undefined,
	KindEnum.SCALAR_TYPE,
	new Type(null, 1),
);
