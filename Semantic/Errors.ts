export class SemanticError extends Error {
	constructor(private code: string, msg?: string) {
		super(msg);
		Object.getOwnPropertyNames(SemanticError.prototype).forEach((key: string) => {
			if (key !== 'constructor') {
				this[key] = this[key].bind(this);
			}
		});
	}
	print() {
		console.error(`${this.code}: ${super.message || 'unknown error'}`);
	}
}

export class NoDeclError extends SemanticError {
	constructor() {
		super('ERR_NO_DECL', 'Variable not declared');
	}
}

export class RedclError extends SemanticError {
	constructor() {
		super('ERR_REDCL', 'Variable already declared');
	}
}

export class TypeNoDeclError extends SemanticError {
	constructor() {
		super('ERR_TYPE_NO_DECL', 'Type not declared');
	}
}

export class ExpectedBoolTypeError extends SemanticError {
	constructor() {
		super('ERR_BOOL_TYPE_EXPECTED', 'Expected Type boolean');
	}
}

export class InvalidTypeError extends SemanticError {
	constructor() {
		super('ERR_INVALID_TYPE', 'Invalid Type for this operation');
	}
}

export class TypeMisMatchError extends SemanticError {
	constructor() {
		super('ERR_TYPE_MISMATCH', 'Type mismatch for this operation');
	}
}

export class NotStructError extends SemanticError {
	constructor() {
		super('ERR_NOT_STRUCT', 'Only Struct Types are allowed for this operation');
	}
}

export class FiledNotDecl extends SemanticError {
	constructor() {
		super('ERR_FIELD_NOT_DECL', 'Field not declared');
	}
}

export class NotArrayError extends SemanticError {
	constructor() {
		super('ERR_NOT_ARRAY', 'Only Array Types are allowed for this operation');
	}
}

export class InvalidIndexError extends SemanticError {
	constructor() {
		super('ERR_INVALID_INDEX', 'Invalid Index for Array');
	}
}

export class NotVarError extends SemanticError {
	constructor() {
		super('ERR_NOT_VAR', 'Only Var Types are allowed for this operation');
	}
}

export class NotFunctionError extends SemanticError {
	constructor() {
		super('ERR_NOT_FUNCTION', 'Only Function Types are allowed for this operation');
	}
}

export class TooFewArgsError extends SemanticError {
	constructor() {
		super('ERR_TOO_FEW_ARGS', 'Number of parameters less than the specified value');
	}
}

export class TooManyArgsError extends SemanticError {
	constructor() {
		super('ERR_TOO_MANY_ARG', 'Number of parameters greater than the specified value');
	}
}

export class ParamTypeError extends SemanticError {
	constructor() {
		super('ERR_PARAM_TYPE', 'Invalid Specified Type');
	}
}

export class ReturnTypeMismatchError extends SemanticError {
	constructor() {
		super(
			'ERR_RETURN_TYPE_MISMATCH',
			'Return Type not compatible with the specified function return Type',
		);
	}
}
