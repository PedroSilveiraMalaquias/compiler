import { States } from '../Syntactic/utils';
import { KindEnum } from './KindEnum';
import { ScalarTypes } from '../Type/ScalarTypes';

export class TokenClass {}

export class Var implements TokenClass {
	constructor(public type?: BlockElement, public index?: number, public size?: number) {}
}

// class Function:
//     def __init__(self, pRetType = None, pParams = None, nIndex = None, nParams = None, nVars = None):
//         self.pRetType = pRetType
//         self.pParams = nParams
//         self.nIndex = nIndex
//         self.nParams = nParams
//         self.nVars = nVars
export class FUNCTION implements TokenClass {
	constructor(
		public retType?: BlockElement,
		public params?: BlockElement,
		public index?: number,
		public nParams?: number,
		public nVars?: number,
	) {}
}

export class Param implements TokenClass {
	constructor(public type?: BlockElement, public index?: number, public size?: number) {}
}

export class TokenAttribute {
	constructor(public state: States, public obj: TokenClass | null, public size?: number) {}
}

export class STRUCT implements TokenClass {
	constructor(public fields?: Field, public nSize?: number) {}
}

export class Field implements TokenClass {
	constructor(public type?: BlockElement, public index?: number, public size?: number) {}
}

export class ALIAS implements TokenClass {
	constructor(public baseType?: BlockElement, public size?: number) {}
}

export class ARRAY implements TokenClass {
	constructor(public elemType?: BlockElement, public numElems?: number, public size?: number) {}
}

export class Type implements TokenClass {
	constructor(public baseType: BlockElement | null, public size?: number) {}
}
export class T implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class E implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class L implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class R implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class Y implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class F implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class LV implements TokenClass {
	constructor(public type?: BlockElement) {}
}

export class MC implements TokenClass {
	constructor(public type?: BlockElement, public param?: BlockElement, public err?: boolean) {}
}

export class MT implements TokenClass {
	constructor(public label?: string) {}
}

export class ME implements TokenClass {
	constructor(public label?: string) {}
}

export class MW implements TokenClass {
	constructor(public label?: string) {}
}

export class MA implements TokenClass {
	constructor(public label?: string) {}
}

export class LE implements TokenClass {
	constructor(
		public type?: BlockElement,
		public param?: TokenClass,
		public err?: boolean,
		public n?: number,
	) {}
}

export class LI implements TokenClass {
	constructor(public list?: TokenClass) {}
}

export class DC implements TokenClass {
	constructor(public list?: TokenClass) {}
}

export class LP implements TokenClass {
	constructor(public list?: BlockElement) {}
}

export class TRUE implements TokenClass {
	constructor(public type?: BlockElement, public val?: boolean) {}
}

export class FALSE implements TokenClass {
	constructor(public type?: BlockElement, public val?: boolean) {}
}

export class CHAR implements TokenClass {
	constructor(public type?: BlockElement, public val?: string, public pos?: number) {}
}

export class STR implements TokenClass {
	constructor(public type?: BlockElement, public val?: string, public pos?: number) {}
}

export class NUM implements TokenClass {
	constructor(public type?: BlockElement, public val?: string, public pos?: number) {}
}

export class BlockElement implements TokenClass {
	constructor(
		public id: number,
		public next?: BlockElement,
		public kind?: KindEnum,
		public obj?: TokenClass,
	) {}
}
