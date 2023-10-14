type LexicalAnalyzer = any;

export class SyntaticalAnalyzer {
  constructor(private lexicalAnalyzer: LexicalAnalyzer) {}
}
