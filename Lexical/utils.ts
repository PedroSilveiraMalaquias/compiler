export enum Tokens {
  ARRAY = "array",
  BOOLEAN = "boolean",
  BREAK = "break",
  CHAR = "char",
  CONTINUE = "continue",
  DO = "do",
  ELSE = "else",
  FALSE = "false",
  FUNCTION = "function",
  IF = "if",
  INTEGER = "integer",
  OF = "of",
  STRING = "string",
  STRUCT = "struct",
  TRUE = "true",
  TYPE = "type",
  VAR = "var",
  WHILE = "while",
  COLON = ":",
  SEMI_COLON = ";",
  COMMA = ",",
  EQUALS = "=",
  LEFT_SQUARE = "[",
  RIGHT_SQUARE = "]",
  LEFT_BRACES = "{",
  RIGHT_BRACES = "}",
  LEFT_PARENTHESIS = "(",
  RIGHT_PARENTHESIS = ")",
  AND = "&&",
  OR = "||",
  LESS_THAN = "<",
  GREATER_THAN = ">",
  LESS_OR_EQUAL = "<=",
  GREATER_OR_EQUAL = ">=",
  NOT_EQUAL = "!=",
  EQUAL_EQUAL = "==",
  PLUS = "+",
  PLUS_PLUS = "++",
  MINUS = "-",
  MINUS_MINUS = "--",
  TIMES = "*",
  DIVIDE = "/",
  DOT = ".",
  NOT = "!",
  CHARACTER = "caracter",
  NUMERAL = "numeral",
  STRINGVAL = "stringval",
  ID = "id",
  UNKNOWN = "unknown",
  EOF = "eof",
}

export const TOKENS: Tokens[] = [
  Tokens.INTEGER,
  Tokens.CHAR,
  Tokens.BOOLEAN,
  Tokens.STRING,
  Tokens.TYPE,
  Tokens.EQUALS,
  Tokens.ARRAY,
  Tokens.LEFT_SQUARE,
  Tokens.RIGHT_SQUARE,
  Tokens.OF,
  Tokens.STRUCT,
  Tokens.LEFT_BRACES,
  Tokens.RIGHT_BRACES,
  Tokens.SEMI_COLON,
  Tokens.COLON,
  Tokens.FUNCTION,
  Tokens.LEFT_PARENTHESIS,
  Tokens.RIGHT_PARENTHESIS,
  Tokens.COMMA,
  Tokens.VAR,
  Tokens.IF,
  Tokens.ELSE,
  Tokens.WHILE,
  Tokens.DO,
  Tokens.BREAK,
  Tokens.CONTINUE,
  Tokens.AND,
  Tokens.OR,
  Tokens.LESS_THAN,
  Tokens.GREATER_THAN,
  Tokens.LESS_OR_EQUAL,
  Tokens.GREATER_OR_EQUAL,
  Tokens.EQUAL_EQUAL,
  Tokens.NOT_EQUAL,
  Tokens.PLUS,
  Tokens.MINUS,
  Tokens.TIMES,
  Tokens.DIVIDE,
  Tokens.PLUS_PLUS,
  Tokens.MINUS_MINUS,
  Tokens.NOT,
  Tokens.DOT,
  Tokens.ID,
  Tokens.TRUE,
  Tokens.FALSE,
  Tokens.CHARACTER,
  Tokens.STRINGVAL,
  Tokens.NUMERAL,
  Tokens.EOF,
];
