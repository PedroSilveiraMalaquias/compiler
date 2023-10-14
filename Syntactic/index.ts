import { LexicalAnalyzer } from "../Lexical";
import { Tokens } from "../Lexical/utils";
import {
  ACTIONS_TABLE_COLUMNS,
  RULES_LEFT,
  RULES_RIGHT,
  States,
} from "./utils";

export class SyntacticAnalyzer {
  private lexicalAnalyzer: LexicalAnalyzer;
  private actionsTable: (string | null)[][];
  private stack: number[] = [];
  private currToken: Tokens | null;
  constructor(
    lexicalAnalyzer: LexicalAnalyzer,
    fileText: string,
    actionsTable: string[][]
  ) {
    this.lexicalAnalyzer = lexicalAnalyzer;
    this.actionsTable = actionsTable;
    this.setup(fileText);
  }

  setup(fileText: string) {
    this.lexicalAnalyzer.setup(fileText);
    this.stack = [];
    this.currToken = null;
  }

  getAction(state: number, token: Tokens | States): string {
    const columnIdx = ACTIONS_TABLE_COLUMNS.indexOf(token);
    // the "+ 1" is because the first column is the state number
    return this.actionsTable[state][columnIdx + 1] ?? "";
  }

  shift(state: number): string {
    this.stack.push(state);
    this.currToken = this.lexicalAnalyzer.getToken();
    return this.getAction(state, this.currToken);
  }

  reduce(rule: number, currToken: Tokens): string {
    if (!RULES_RIGHT[rule - 1]) throw new Error("Invalid reduce parameter");
    if (!this.stack?.length || this.stack.length < RULES_RIGHT[rule - 1])
      throw new Error("Invalid stack lenght on reduce");

    this.stack.slice(0, this.stack.length - RULES_RIGHT[rule - 1]);

    const state = parseInt(
      this.getAction(
        // FIXME: this plus one is right?
        this.stack[this.stack.length - 1] + 1,
        RULES_LEFT[rule - 1]
      )
    );
    if (Number.isNaN(state)) throw new Error("Invalid state on reduce");
    this.stack.push(state);
    return this.getAction(state, currToken);
  }

  execute() {
    try {
      let action = this.shift(0);
      while (action !== "acc") {
        const isValidToken = this.lexicalAnalyzer.validateToken(this.currToken);
        if (!this.currToken || !isValidToken) return;

        if (action[0] === "s") {
          let state = parseInt(action.slice(1));
          if (Number.isNaN(state)) throw new Error("Invalid rule");
          action = this.shift(state);
        } else if (action[0] === "r") {
          let rule = parseInt(action.slice(1));
          if (Number.isNaN(rule)) throw new Error("Invalid rule");
          action = this.reduce(rule, this.currToken);
          // TODO: do semantic_analysis here
          // ex:Semantic_Analysis(self.lexical, rule)
        } else {
          throw new Error("Invalid action");
        }
      }
    } catch (err) {
      console.log(`Sintaxe Error in line ${this.lexicalAnalyzer.line}`);
      return;
    }
  }
}
