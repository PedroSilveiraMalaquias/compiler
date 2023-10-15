import {
	ExpectedBoolTypeError,
	InvalidTypeError,
	NoDeclError,
	NotArrayError,
	NotStructError,
	NotVarError,
	RedclError,
	TypeMisMatchError,
} from './Errors';
import { LexicalAnalyzer } from '../Lexical';
import { Scope } from '../Scope';
import { Rules } from './Rules';
import { KindEnum } from './KindEnum';
import {
	TokenAttribute,
	BlockElement,
	LI,
	T,
	TRUE,
	CHAR,
	STR,
	NUM,
	ARRAY,
	ALIAS,
	Field,
	DC,
	STRUCT,
	Param,
	LP,
	FUNCTION,
	E,
	L,
	R,
	Y,
	F,
	LV,
	Type,
	Var,
	MC,
} from './tokenClasses';
import { States } from '../Syntactic/utils';
import {
	boolScalar,
	charScalar,
	intScalar,
	stringScalar,
	universalScalar,
} from '../Type/ScalarTypes';
import { TypeHelper } from '../Type';

export class SemanticAnalyzer {
	private lexicalAnalyzer: LexicalAnalyzer;
	private fileText: string;
	private scope: Scope;
	public currFunction: BlockElement;
	tokenId: number | null = null;
	n: string = '';
	rLael: string = '';

	stack: TokenAttribute[] = [];
	constructor(lexicalAnalyzer: LexicalAnalyzer, fileText: string) {
		this.setup(fileText);
		this.lexicalAnalyzer = lexicalAnalyzer;
		this.fileText = fileText;
		this.scope = new Scope();
	}

	setup(fileText: string) {
		this.lexicalAnalyzer.setup(fileText);
	}

	execute(rule: number) {
		let blockElement: BlockElement | null = null;

		if (rule === Rules.IDD_RULE) {
			this.tokenId = this.lexicalAnalyzer.tokenId;
			if (!this.tokenId) return;
			blockElement = this.scope.search(this.tokenId);
			if (blockElement) new RedclError().print();
			else {
				blockElement = this.scope.define(this.tokenId);
			}
			blockElement.kind = KindEnum.NO_KIND_DEF;
			this.stack.push(new TokenAttribute(States.IDD, blockElement));
		} else if (rule === Rules.IDU_RULE) {
			this.tokenId = this.lexicalAnalyzer.tokenId;
			if (!this.tokenId) return;
			blockElement = this.scope.find(this.tokenId);
			if (!blockElement) {
				blockElement = this.scope.define(this.tokenId);
				new NoDeclError().print();
			}
			this.stack.push(new TokenAttribute(States.IDU, blockElement));
		} else if (rule === Rules.ID_RULE) {
			this.tokenId = this.lexicalAnalyzer.tokenId;
			if (!this.tokenId) return;
			this.stack.push(new TokenAttribute(States.ID, new BlockElement(this.tokenId)));
		} else if (rule === Rules.T_IDU_RULE) {
			let TokenAttribute = this.stack.pop();
			const blockElement = TokenAttribute?.obj;
			if (!blockElement) return;
			// if((blockElement as BlockElement))
		} else if (rule === Rules.T_INTEGER_RULE) {
			this.stack.push(new TokenAttribute(States.T, new T(intScalar), 1));
		} else if (rule === Rules.T_CHAR_RULE) {
			this.stack.push(new TokenAttribute(States.T, new T(charScalar), 1));
		} else if (rule === Rules.T_BOOL_RULE) {
			this.stack.push(new TokenAttribute(States.T, new T(boolScalar), 1));
		} else if (rule === Rules.T_STRING_RULE) {
			this.stack.push(new TokenAttribute(States.T, new T(stringScalar), 1));
		} else if (rule === Rules.LI_IDD_RULE) {
			const idd = this.stack.pop();
			const li = this.stack.pop();
			if (!idd || !idd.obj || !li) return;
			this.stack.push(new TokenAttribute(States.LI, new LI((idd.obj as BlockElement).obj)));
		} else if (rule === Rules.LI_COMMA_RULE) {
			const idd = this.stack.pop();
			const LI1 = this.stack.pop();
			const LI2 = this.stack.pop();
			if (!idd || !LI1 || !LI2 || !LI1.obj) return;
			this.stack.push(new TokenAttribute(States.LI, new LI((LI1.obj as LI).list)));
		} else if (rule === Rules.TRUE_RULE) {
			this.stack.push(new TokenAttribute(States.TRUE, new TRUE(boolScalar, true)));
		} else if (rule === Rules.FALSE_RULE) {
			this.stack.push(new TokenAttribute(States.FALSE, new TRUE(boolScalar, false)));
		} else if (rule === Rules.CHR_RULE) {
			const tokenId = this.lexicalAnalyzer.tokenId;
			if (!tokenId) return;
			this.stack.push(
				new TokenAttribute(States.CHR, new CHAR(charScalar, this.lexicalAnalyzer.getCte(tokenId))),
			);
		} else if (rule === Rules.STR_RULE) {
			const tokenId = this.lexicalAnalyzer.tokenId;
			if (!tokenId) return;
			this.stack.push(
				new TokenAttribute(
					States.STR,
					new STR(stringScalar, this.lexicalAnalyzer.getCte(tokenId), tokenId),
				),
			);
		} else if (rule === Rules.NUM_RULE) {
			const tokenId = this.lexicalAnalyzer.tokenId;
			if (!tokenId) return;
			this.stack.push(
				new TokenAttribute(
					States.NUM,
					new NUM(intScalar, this.lexicalAnalyzer.getCte(tokenId)),
					tokenId,
				),
			);
		} else if (rule === Rules.DT_ARRAY_RULE) {
			const type = this.stack.pop();
			const num = this.stack.pop();
			const idd = this.stack.pop();
			const n = Number((num?.obj as NUM).val);
			if (!type || !num || !idd || !idd.obj) return;
			const blockElement = (idd.obj as BlockElement).obj as BlockElement;
			blockElement.kind = KindEnum.ARRAY_TYPE;
			blockElement.obj = new ARRAY((type.obj as T).type, n, n * (type.size || 0));
		} else if (rule === Rules.DT_ALIAS_RULE) {
			const type = this.stack.pop();
			const idd = this.stack.pop();
			const blockElement = (idd?.obj as BlockElement).obj as BlockElement;
			if (!type || !idd || !blockElement) return;
			blockElement.kind = KindEnum.ALIAS_TYPE;
			blockElement.obj = new ALIAS((type.obj as T).type, type.size);
		} else if (rule === Rules.DC_LI_RULE) {
			const type = this.stack.pop();
			const li = this.stack.pop();
			if (!type || !li) return;
			let blockElement = (li.obj as LI).list as BlockElement | null;

			let idx = 0;
			while (blockElement && blockElement.kind === KindEnum.NO_KIND_DEF) {
				blockElement.kind = KindEnum.FIELD;
				blockElement.obj = new Field((type.obj as T).type, idx, type.size || 0);
				blockElement = blockElement.next || null;
				idx++;
			}
			const dc = new TokenAttribute(States.DC, new DC((li.obj as LI).list), idx);
			this.stack.push(dc);
		} else if (rule === Rules.DC_DC_RULE) {
			const type = this.stack.pop();
			const li = this.stack.pop();
			const dc1 = this.stack.pop();
			if (!type || !li || !dc1) return;
			let blockElement = (li?.obj as LI).list as BlockElement | null;
			let idx = dc1?.size || 0;
			while (blockElement && blockElement.kind === KindEnum.NO_KIND_DEF) {
				blockElement.kind = KindEnum.FIELD;
				blockElement.obj = new Field((type.obj as T).type, idx, type.size || 0);
				blockElement = blockElement.next || null;
				idx += type.size || 0;
			}
			const dc = new TokenAttribute(States.DC, new DC((dc1.obj as DC).list), idx);
			this.stack.push(dc);
		} else if (rule === Rules.NB_RULE) {
			this.scope.newBlock();
		} else if (rule === Rules.DT_STRUCT_RULE) {
			const dc = this.stack.pop();
			const idd = this.stack.pop();
			if (!dc || !idd || !idd.obj) return;
			const blockElement = (idd.obj as BlockElement).obj as BlockElement;
			blockElement.kind = KindEnum.STRUCT_TYPE;
			blockElement.obj = new STRUCT((dc.obj as DC).list, dc.size);
			this.scope.endBlock();
		} else if (rule === Rules.LP_IDD_RULE) {
			const type = this.stack.pop();
			const idd = this.stack.pop();
			if (!type || !idd || !idd.obj) return;
			const blockElement = (idd.obj as BlockElement).obj as BlockElement;
			blockElement.kind = KindEnum.PARAM;
			blockElement.obj = new Param((type.obj as T).type, 0, type.size || 0);
			this.stack.push(new TokenAttribute(States.LP, new LP(blockElement), type.size));
		} else if (rule === Rules.LP_LP_RULE) {
			const type = this.stack.pop();
			const idd = this.stack.pop();
			const lp1 = this.stack.pop();
			if (!type || !idd || !idd.obj || !lp1) return;
			const blockElement = (idd.obj as BlockElement).obj as BlockElement;
			blockElement.kind = KindEnum.PARAM;
			blockElement.obj = new Param((type.obj as T).type, lp1.size, type.size || 0);
			this.stack.push(
				new TokenAttribute(
					States.LP,
					new LP((lp1.obj as LP).list),
					(type.size || 0) + (lp1.size || 0),
				),
			);
		} else if (rule === Rules.NF_RULE) {
			const idd = this.stack.pop();
			let f = (idd?.obj as BlockElement).obj as BlockElement;
			if (!f) return;
			f.kind = KindEnum.FUNCTION;
			f.obj = new FUNCTION(undefined, undefined, this.scope.nFuncs, 0, 0);
			this.scope.nFuncs++;
			this.scope.newBlock();
		} else if (rule === Rules.MF_RULE) {
			const type = this.stack.pop();
			const lp = this.stack.pop();
			const idd = this.stack.pop();
			const f = (idd?.obj as BlockElement).obj as BlockElement;
			if (!f || !type || !lp || !f.obj) return;
			f.kind = KindEnum.FUNCTION;
			f.obj = new FUNCTION(
				(type.obj as T).type,
				(lp.obj as LP).list,
				(f.obj as FUNCTION).index,
				lp.size,
				lp.size,
			);
			this.currFunction = f;
		} else if (rule === Rules.DF_RULE) {
			this.scope.endBlock();
		} else if (rule === Rules.U_IF_RULE) {
			const mt = this.stack.pop();
			const e = this.stack.pop();
			if (!mt || !e || !e.obj) return;
			const t = (e.obj as E).type;
			if (!t || !TypeHelper.checkTypes(t, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
		} else if (rule === Rules.U_IF_ELSE_U_RULE) {
			const me = this.stack.pop();
			const mt = this.stack.pop();
			const e = this.stack.pop();
			if (!me || !mt || !e || !e.obj) return;
			const t = (e.obj as E).type;
			if (!t || !TypeHelper.checkTypes(t, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
		} else if (rule === Rules.M_IF_ELSE_M_RULE) {
			const me = this.stack.pop();
			const mt = this.stack.pop();
			const e = this.stack.pop();
			if (!me || !mt || !e || !e.obj) return;
			const t = (e.obj as E).type;
			if (!t || !TypeHelper.checkTypes(t, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
		} else if (rule === Rules.M_WHILE_RULE) {
			const mt = this.stack.pop();
			const e = this.stack.pop();
			const mw = this.stack.pop();
			if (!mt || !e || !e.obj || !mw) return;
			const t = (e.obj as E).type;
			if (!t || !TypeHelper.checkTypes(t, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
		} else if (rule === Rules.M_DO_WHILE_RULE) {
			const e = this.stack.pop();
			const mw = this.stack.pop();
			if (!e || !e.obj || !mw) return;
			const t = (e.obj as E).type;
			if (!t || !TypeHelper.checkTypes(t, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
		} else if (rule === Rules.E_AND_RULE) {
			const l = this.stack.pop();
			const e1 = this.stack.pop();
			const t1 = (e1?.obj as E).type;
			const t2 = (l?.obj as L).type;
			if (!l || !e1 || !t1 || !t2) return;
			if (!TypeHelper.checkTypes(t1, boolScalar) || !TypeHelper.checkTypes(t2, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.E, new E(boolScalar)));
		} else if (rule === Rules.E_OR_RULE) {
			const l = this.stack.pop();
			const e1 = this.stack.pop();
			const t1 = (e1?.obj as E).type;
			const t2 = (l?.obj as L).type;
			if (!l || !e1 || !t1 || !t2) return;
			if (!TypeHelper.checkTypes(t1, boolScalar) || !TypeHelper.checkTypes(t2, boolScalar)) {
				new ExpectedBoolTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.E, new E(boolScalar)));
		} else if (rule === Rules.E_L_RULE) {
			const l = this.stack.pop();
			const e = new TokenAttribute(States.E, new E((l?.obj as L).type));
			this.stack.push(e);
		} else if (rule === Rules.L_LESS_THAN_RULE) {
			const r = this.stack.pop();
			const l1 = this.stack.pop();
			const type1 = (l1?.obj as L).type;
			const type2 = (r?.obj as R).type;
			if (!r || !l1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			this.stack.push(new TokenAttribute(States.L, new L(boolScalar)));
		} else if (rule === Rules.L_GREATER_THAN_RULE) {
			const r = this.stack.pop();
			const l1 = this.stack.pop();
			const type1 = (l1?.obj as L).type;
			const type2 = (r?.obj as R).type;
			if (!r || !l1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			this.stack.push(new TokenAttribute(States.L, new L(boolScalar)));
		} else if (rule === Rules.L_LESS_EQUAL_RULE) {
			const r = this.stack.pop();
			const l1 = this.stack.pop();
			const type1 = (l1?.obj as L).type;
			const type2 = (r?.obj as R).type;
			if (!r || !l1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			this.stack.push(new TokenAttribute(States.L, new L(boolScalar)));
		} else if (rule === Rules.L_GREATER_EQUAL_RULE) {
			const r = this.stack.pop();
			const l1 = this.stack.pop();
			const type1 = (l1?.obj as L).type;
			const type2 = (r?.obj as R).type;
			if (!r || !l1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			this.stack.push(new TokenAttribute(States.L, new L(boolScalar)));
		} else if (rule === Rules.L_EQUAL_EQUAL_RULE) {
			const r = this.stack.pop();
			const l1 = this.stack.pop();
			const type1 = (l1?.obj as L).type;
			const type2 = (r?.obj as R).type;
			if (!r || !l1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			this.stack.push(new TokenAttribute(States.L, new L(boolScalar)));
		} else if (rule === Rules.L_NOT_EQUAL_RULE) {
			const r = this.stack.pop();
			const l1 = this.stack.pop();
			const type1 = (l1?.obj as L).type;
			const type2 = (r?.obj as R).type;
			if (!r || !l1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			this.stack.push(new TokenAttribute(States.L, new L(boolScalar)));
		} else if (rule === Rules.L_R_RULE) {
			const r = this.stack.pop();
			const l = new TokenAttribute(States.L, new L((r?.obj as R).type));
			this.stack.push(l);
		} else if (rule === Rules.R_PLUS_RULE) {
			const y = this.stack.pop();
			const r1 = this.stack.pop();
			const type1 = (r1?.obj as R).type;
			const type2 = (y?.obj as Y).type;
			if (!y || !r1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			if (!TypeHelper.checkTypes(type1, intScalar) && !TypeHelper.checkTypes(type1, stringScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.R, new R(type1)));
		} else if (rule === Rules.R_MINUS_RULE) {
			const y = this.stack.pop();
			const r1 = this.stack.pop();
			const type1 = (r1?.obj as R).type;
			const type2 = (y?.obj as Y).type;
			if (!y || !r1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			if (!TypeHelper.checkTypes(type1, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.R, new R(type1)));
		} else if (rule === Rules.R_Y_RULE) {
			const y = this.stack.pop();
			const r = new TokenAttribute(States.R, new R((y?.obj as Y).type));
			this.stack.push(r);
		} else if (rule === Rules.Y_TIMES_RULE) {
			const f = this.stack.pop();
			const y1 = this.stack.pop();
			const type1 = (y1?.obj as Y).type;
			const type2 = (f?.obj as F).type;
			if (!f || !y1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			if (!TypeHelper.checkTypes(type1, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.Y, new Y(type1)));
		} else if (rule === Rules.Y_DIVIDE_RULE) {
			const f = this.stack.pop();
			const y1 = this.stack.pop();
			const type1 = (y1?.obj as Y).type;
			const type2 = (f?.obj as F).type;
			if (!f || !y1 || !type1 || !type2) return;
			if (!TypeHelper.checkTypes(type1, type2)) {
				new TypeMisMatchError().print();
			}
			if (!TypeHelper.checkTypes(type1, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.Y, new Y(type1)));
		} else if (rule === Rules.Y_F_RULE) {
			const f = this.stack.pop();
			const y = new TokenAttribute(States.Y, new Y((f?.obj as F).type));
			this.stack.push(y);
		} else if (rule === Rules.F_LV_RULE) {
			const lv = this.stack.pop();
			const type = (lv?.obj as LV).type;
			if (!lv || !type) return;
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_LEFT_PLUS_PLUS_RULE) {
			const lv = this.stack.pop();
			const type = (lv?.obj as LV).type;
			if (!lv || !type) return;
			if (!TypeHelper.checkTypes(type, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_LEFT_MINUS_MINUS_RULE) {
			const lv = this.stack.pop();
			const type = (lv?.obj as LV).type;
			if (!lv || !type) return;
			if (!TypeHelper.checkTypes(type, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_RIGHT_PLUS_PLUS_RULE) {
			const lv = this.stack.pop();
			const type = (lv?.obj as LV).type;
			if (!lv || !type) return;
			if (!TypeHelper.checkTypes(type, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_RIGHT_MINUS_MINUS_RULE) {
			const lv = this.stack.pop();
			const type = (lv?.obj as LV).type;
			if (!lv || !type) return;
			if (!TypeHelper.checkTypes(type, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_PARENTHESIS_E_RULE) {
			const e = this.stack.pop();
			const type = (e?.obj as E).type;
			if (!e || !type) return;
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_MINUS_F_RULE) {
			const f1 = this.stack.pop();
			const type = (f1?.obj as F).type;
			if (!f1 || !type) return;
			if (!TypeHelper.checkTypes(type, intScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_NOT_F_RULE) {
			const f1 = this.stack.pop();
			const type = (f1?.obj as F).type;
			if (!f1 || !type) return;
			if (!TypeHelper.checkTypes(type, boolScalar)) {
				new InvalidTypeError().print();
			}
			this.stack.push(new TokenAttribute(States.F, new F(type)));
		} else if (rule === Rules.F_TRUE_RULE) {
			const tru = this.stack.pop();
			this.stack.push(new TokenAttribute(States.F, new F(boolScalar)));
		} else if (rule === Rules.F_FALSE_RULE) {
			const fals = this.stack.pop();
			this.stack.push(new TokenAttribute(States.F, new F(boolScalar)));
		} else if (rule === Rules.F_CHR_RULE) {
			const ch = this.stack.pop();
			this.stack.push(new TokenAttribute(States.F, new F(charScalar)));
		} else if (rule === Rules.F_STR_RULE) {
			const str = this.stack.pop();
			this.stack.push(new TokenAttribute(States.F, new F(stringScalar)));
		} else if (rule === Rules.F_NUM_RULE) {
			const num = this.stack.pop();
			this.stack.push(new TokenAttribute(States.F, new F(intScalar)));
		} else if (rule === Rules.LV_DOT_RULE) {
			const id = this.stack.pop();
			const lv = this.stack.pop();
			let lv0;
			const type = (lv?.obj as LV).type;
			if (!id || !lv || !type) return;
			if (type.kind !== KindEnum.STRUCT_TYPE) {
				if (type.kind !== KindEnum.UNIVERSAL) {
					new NotStructError().print();
				}
				lv0 = new TokenAttribute(States.LV, new LV(universalScalar));
			} else {
				let blockElement = (type.obj as STRUCT).fields;
				while (blockElement) {
					if (blockElement.type?.id === (id.obj as BlockElement).id) {
						break;
					}
					blockElement = blockElement.type?.next as Field;
				}
				if (!blockElement) {
					new NoDeclError().print();
					lv0 = new TokenAttribute(States.LV, new LV(universalScalar));
				} else {
					lv0 = new TokenAttribute(States.LV, new LV((blockElement.type?.obj as T).type));
					lv0.obj.type = new Type(null, (blockElement.type?.obj as Field).size);
				}
				this.stack.push(lv0);
			}
		} else if (rule === Rules.LV_SQUARE_RULE) {
			const e = this.stack.pop();
			const lv = this.stack.pop();
			let lv0;
			const type = (lv?.obj as LV).type;
			if (!e || !lv || !type) return;
			if (TypeHelper.checkTypes(type, stringScalar)) {
				lv0 = new TokenAttribute(States.LV, new LV(charScalar));
			} else if (type.kind !== KindEnum.ARRAY_TYPE) {
				if (type.kind !== KindEnum.UNIVERSAL) {
					new NotArrayError().print();
				}
				lv0 = new TokenAttribute(States.LV, new LV(universalScalar));
			} else {
				lv0 = new TokenAttribute(States.LV, new LV((type.obj as ARRAY).elemType));
			}

			if (!TypeHelper.checkTypes((e.obj as E).type!, intScalar)) {
				new InvalidTypeError().print();
			}

			this.stack.push(lv0);
		} else if (rule === Rules.LV_IDU_RULE) {
			const idu = this.stack.pop();
			const blockElement = (idu?.obj as BlockElement).obj as BlockElement;
			if (!idu || !blockElement) return;
			if (blockElement.kind !== KindEnum.VAR && blockElement.kind !== KindEnum.PARAM) {
				if (blockElement.kind !== KindEnum.UNIVERSAL) {
					new NotVarError().print();
				}
				this.stack.push(new TokenAttribute(States.LV, new LV(universalScalar)));
			} else {
				this.stack.push(new TokenAttribute(States.LV, new LV((blockElement.obj as Var).type)));
			}
		} else if (rule === Rules.MC_RULE) {
			const idu = this.stack[this.stack.length - 1];
			const blockElement = (idu?.obj as BlockElement).obj as BlockElement;
			if (!idu || !blockElement) return;
			if (blockElement.kind !== KindEnum.FUNCTION) {
				this.stack.push(new TokenAttribute(States.MC, new MC(universalScalar, undefined, true)));
			} else {
				this.stack.push(
					new TokenAttribute(
						States.MC,
						new MC(
							(blockElement.obj as FUNCTION).retType,
							(blockElement.obj as FUNCTION).params,
							false,
						),
					),
				);
			}
		} else if (rule === Rules.LE_E_RULE) {
			// fazer esses
		} else if (rule === Rules.LE_LE_RULE) {
		} else if (rule === Rules.F_IDU_MC_RULE) {
		} else if (rule === Rules.MT_RULE) {
		} else if (rule === Rules.ME_RULE) {
		} else if (rule === Rules.MW_RULE) {
		} else if (rule === Rules.M_BREAK_RULE) {
		} else if (rule === Rules.M_CONTINUE_RULE) {
		} else if (rule === Rules.M_E_SEMICOLON) {
		} else {
			// TODO: add log here
			return false;
		}

		return true;
	}
}
