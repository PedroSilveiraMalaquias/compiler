import { Tokens } from './utils';

const reservedWords = [
	Tokens.ARRAY,
	Tokens.BOOLEAN,
	Tokens.BREAK,
	Tokens.CHAR,
	Tokens.CONTINUE,
	Tokens.DO,
	Tokens.ELSE,
	Tokens.FALSE,
	Tokens.FUNCTION,
	Tokens.IF,
	Tokens.INTEGER,
	Tokens.OF,
	Tokens.STRING,
	Tokens.STRUCT,
	Tokens.TRUE,
	Tokens.TYPE,
	Tokens.VAR,
	Tokens.WHILE,
];

const isChar = (c: string): boolean => c.length === 1;

const isDigit = (c: string): boolean => isChar(c) && c >= '0' && c <= '9';
const isAlpha = (c: string): boolean =>
	isChar(c) && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
const isAlNum = (c: string): boolean => isChar(c) && (isAlpha(c) || isDigit(c));

const isSpace = (c: string): boolean =>
	c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v';

export class LexicalAnalyzer {
	private fileText: string;
	private readerPosi: number;
	private readerChar: string;
	public line: number = 1;
	private ch: number = 1;
	public tokenId: number | null;
	private v_Ctes: string[] = [];
	private identifiers: { [key: string]: number } = {};
	private count: number = 0;

	constructor(fileText: string) {
		this.setup(fileText);
	}

	addCte(c: string): number {
		this.v_Ctes.push(c);
		return this.v_Ctes.length - 1;
	}

	getCte(c: number): string {
		return this.v_Ctes[c];
	}

	searchName(name: string): number {
		if (!this.identifiers[name]) {
			this.identifiers[name] = this.count;
			this.count++;
		}
		return this.identifiers[name];
	}

	setup(fileText: string) {
		this.readerPosi = 0;
		this.readerChar = fileText[0];
		this.fileText = fileText;
		this.line = 1;
		this.ch = 1;
		this.v_Ctes = [];
		this.identifiers = {};
		this.count = 0;
	}

	searchReservedWords(word: string): Tokens {
		return reservedWords.includes(word as Tokens) ? (word as Tokens) : Tokens.ID;
	}

	readNextChar(step: number = 1): string {
		this.readerPosi += step;
		this.ch += step;
		this.readerChar = this.fileText[this.readerPosi];
		return this.readerChar;
	}

	getToken(): Tokens {
		let token: Tokens = Tokens.UNKNOWN;

		while (isSpace(this.readerChar)) {
			if (this.readerChar === '\n') {
				this.line++;
				this.ch = 1;
			}
			this.readerPosi++;
			this.readerChar = this.fileText[this.readerPosi];
		}

		if (this.readerChar === undefined) {
			token = Tokens.EOF;
		} else if (isAlNum(this.readerChar)) {
			let tokenAux: string = '';
			while (isAlNum(this.readerChar) || this.readerChar === '_') {
				tokenAux += this.readerChar;
				this.readNextChar();
			}
			token = this.searchReservedWords(tokenAux);
			if (token === Tokens.ID) {
				this.tokenId = this.searchName(tokenAux);
			}
		} else if (isDigit(this.readerChar)) {
			let num: string = '';
			while (isDigit(this.readerChar)) {
				num += this.readerChar;
				this.readNextChar();
			}
			token = Tokens.NUMERAL;
			this.tokenId = this.addCte(num);
		} else if (this.readerChar === '"') {
			let str: string = this.readerChar;
			this.readNextChar();
			while (this.readerChar !== '"') {
				str += this.readerChar;
				this.readNextChar();
			}
			str += this.readerChar;
			this.readNextChar();
			token = Tokens.STRING;
			this.tokenId = this.addCte(str);
		} else {
			if (this.readerChar === "'") {
				this.readNextChar();
				token = Tokens.CHARACTER;
				this.tokenId = this.addCte(this.readerChar);
				this.readNextChar(2);
			} else if (this.readerChar === ':') {
				this.readNextChar();
				token = Tokens.COLON;
			} else if (this.readerChar === '+') {
				token = Tokens.PLUS;
				if (this.readNextChar() === '+') {
					this.readNextChar();
					token = Tokens.PLUS_PLUS;
				}
			} else if (this.readerChar === '-') {
				token = Tokens.MINUS;
				if (this.readNextChar() === '-') {
					this.readNextChar();
					token = Tokens.MINUS_MINUS;
				}
			} else if (this.readerChar === ';') {
				this.readNextChar();
				token = Tokens.SEMI_COLON;
			} else if (this.readerChar === ',') {
				this.readNextChar();
				token = Tokens.COMMA;
			} else if (this.readerChar === '=') {
				token = Tokens.EQUALS;
				if (this.readNextChar() === '=') {
					this.readNextChar();
					token = Tokens.EQUAL_EQUAL;
				}
			} else if (this.readerChar === '[') {
				this.readNextChar();
				token = Tokens.LEFT_SQUARE;
			} else if (this.readerChar === ']') {
				this.readNextChar();
				token = Tokens.RIGHT_SQUARE;
			} else if (this.readerChar === '{') {
				this.readNextChar();
				token = Tokens.LEFT_BRACES;
			} else if (this.readerChar === '}') {
				this.readNextChar();
				token = Tokens.RIGHT_BRACES;
			} else if (this.readerChar === '(') {
				this.readNextChar();
				token = Tokens.LEFT_PARENTHESIS;
			} else if (this.readerChar === ')') {
				this.readNextChar();
				token = Tokens.RIGHT_PARENTHESIS;
			} else if (this.readerChar === '&') {
				this.readNextChar();
				if (this.readerChar === '&') {
					this.readNextChar();
					token = Tokens.AND;
				} else {
					token = Tokens.UNKNOWN;
				}
			} else if (this.readerChar === '|') {
				this.readNextChar();
				if (this.readerChar === '|') {
					this.readNextChar();
					token = Tokens.OR;
				} else {
					token = Tokens.UNKNOWN;
				}
			} else if (this.readerChar === '<') {
				if (this.readNextChar() === '=') {
					this.readNextChar();
					token = Tokens.LESS_OR_EQUAL;
				} else {
					token = Tokens.LESS_THAN;
				}
			} else if (this.readerChar === '>') {
				if (this.readNextChar() === '=') {
					this.readNextChar();
					token = Tokens.GREATER_OR_EQUAL;
				} else {
					token = Tokens.GREATER_THAN;
				}
			} else if (this.readerChar === '!') {
				if (this.readNextChar() === '=') {
					this.readNextChar();
					token = Tokens.NOT_EQUAL;
				} else {
					token = Tokens.NOT;
				}
			} else if (this.readerChar === '*') {
				this.readNextChar();
				token = Tokens.TIMES;
			} else if (this.readerChar === '/') {
				this.readNextChar();
				token = Tokens.DIVIDE;
			} else if (this.readerChar === '.') {
				this.readNextChar();
				token = Tokens.DOT;
			} else {
				token = Tokens.UNKNOWN;
			}
		}

		return token;
	}

	validateToken(token?: Tokens | null): boolean {
		if (!token || token === Tokens.UNKNOWN) {
			console.error(`Character ${this.ch + 1} not expected in the line ${this.line}`);
			return false;
		}
		return true;
	}

	execute() {
		let currToken: Tokens = this.getToken();
		while (currToken !== Tokens.EOF) {
			const isValidToken = this.validateToken(currToken);
			if (!isValidToken) return;
			currToken = this.getToken();
		}
		console.log('No lexical errors.');
	}
}
