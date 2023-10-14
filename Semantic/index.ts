import { LexicalAnalyzer } from "../Lexical";
import { Rules } from "./Rules";

export class SemanticAnalyzer {
  private lexicalAnalyzer: LexicalAnalyzer;
  private fileText: string;

  tokenId: number | null = null;
  n: string = "";
  rLael: string = "";

  hasError: boolean = false;
  stack: string[] = [];
  constructor(lexicalAnalyzer: LexicalAnalyzer, fileText: string) {
    this.setup(fileText);
    this.lexicalAnalyzer = lexicalAnalyzer;
    this.fileText = fileText;
  }

  setup(fileText: string) {
    this.lexicalAnalyzer.setup(fileText);
  }

  execute(rule: number): boolean {
    if (rule === Rules.IDD_RULE) {
      this.tokenId = this.lexicalAnalyzer.tokenId;
      //  p = this.search(this.tokenId);
    } else if (rule === Rules.IDU_RULE) {
    } else if (rule === Rules.ID_RULE) {
    } else if (rule === Rules.T_IDU_RULE) {
    } else if (rule === Rules.T_INTEGER_RULE) {
    } else if (rule === Rules.T_CHAR_RULE) {
    } else if (rule === Rules.T_BOOL_RULE) {
    } else if (rule === Rules.T_STRING_RULE) {
    } else if (rule === Rules.LI_IDD_RULE) {
    } else if (rule === Rules.LI_COMMA_RULE) {
    } else if (rule === Rules.TRUE_RULE) {
    } else if (rule === Rules.FALSE_RULE) {
    } else if (rule === Rules.CHR_RULE) {
    } else if (rule === Rules.STR_RULE) {
    } else if (rule === Rules.NUM_RULE) {
    } else if (rule === Rules.DT_ARRAY_RULE) {
    } else if (rule === Rules.DT_ALIAS_RULE) {
    } else if (rule === Rules.DC_LI_RULE) {
    } else if (rule === Rules.DC_DC_RULE) {
    } else if (rule === Rules.NB_RULE) {
    } else if (rule === Rules.DT_STRUCT_RULE) {
    } else if (rule === Rules.LP_IDD_RULE) {
    } else if (rule === Rules.LP_LP_RULE) {
    } else if (rule === Rules.NF_RULE) {
    } else if (rule === Rules.MF_RULE) {
    } else if (rule === Rules.DF_RULE) {
    } else if (rule === Rules.U_IF_RULE) {
    } else if (rule === Rules.U_IF_ELSE_U_RULE) {
    } else if (rule === Rules.M_IF_ELSE_M_RULE) {
    } else if (rule === Rules.M_WHILE_RULE) {
    } else if (rule === Rules.M_DO_WHILE_RULE) {
    } else if (rule === Rules.E_AND_RULE) {
    } else if (rule === Rules.E_OR_RULE) {
    } else if (rule === Rules.E_L_RULE) {
    } else if (rule === Rules.L_LESS_THAN_RULE) {
    } else if (rule === Rules.L_GREATER_THAN_RULE) {
    } else if (rule === Rules.L_LESS_EQUAL_RULE) {
    } else if (rule === Rules.L_GREATER_EQUAL_RULE) {
    } else if (rule === Rules.L_EQUAL_EQUAL_RULE) {
    } else if (rule === Rules.L_NOT_EQUAL_RULE) {
    } else if (rule === Rules.L_R_RULE) {
    } else if (rule === Rules.R_PLUS_RULE) {
    } else if (rule === Rules.R_MINUS_RULE) {
    } else if (rule === Rules.R_Y_RULE) {
    } else if (rule === Rules.Y_TIMES_RULE) {
    } else if (rule === Rules.Y_DIVIDE_RULE) {
    } else if (rule === Rules.Y_F_RULE) {
    } else if (rule === Rules.F_LV_RULE) {
    } else if (rule === Rules.F_LEFT_PLUS_PLUS_RULE) {
    } else if (rule === Rules.F_LEFT_MINUS_MINUS_RULE) {
    } else if (rule === Rules.F_RIGHT_PLUS_PLUS_RULE) {
    } else if (rule === Rules.F_RIGHT_MINUS_MINUS_RULE) {
    } else if (rule === Rules.F_PARENTHESIS_E_RULE) {
    } else if (rule === Rules.F_MINUS_F_RULE) {
    } else if (rule === Rules.F_NOT_F_RULE) {
    } else if (rule === Rules.F_TRUE_RULE) {
    } else if (rule === Rules.F_FALSE_RULE) {
    } else if (rule === Rules.F_CHR_RULE) {
    } else if (rule === Rules.F_STR_RULE) {
    } else if (rule === Rules.F_NUM_RULE) {
    } else if (rule === Rules.LV_DOT_RULE) {
    } else if (rule === Rules.LV_SQUARE_RULE) {
    } else if (rule === Rules.LV_IDU_RULE) {
    } else if (rule === Rules.MC_RULE) {
    } else if (rule === Rules.LE_E_RULE) {
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
