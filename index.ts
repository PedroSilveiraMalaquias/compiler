import { LexicalAnalyzer } from "./Lexical";
import * as fs from "fs";
import { SyntacticAnalyzer } from "./Syntactic";

const codeFilePath = "./codigo-teste-2.ssl";
const tableFilePath = "./action_table.csv";

fs.readFile(codeFilePath, "utf8", (error, data) => {
  if (error) return console.error("Error reading the code file: ", error);

  // Execute the lexical analyzer
  const lexicalAnalyzer = new LexicalAnalyzer(data);
  lexicalAnalyzer.execute();

  fs.readFile(tableFilePath, "utf8", (aError, aData) => {
    if (aError)
      return console.error("Error reading the actions table file: ", aError);

    // Execute the synctatic analyzer (witch will also execute the lexical analyzer and the semantic analyzer)
    // FIXME: transform the aData in array of array of strings
    const synctaticAnalyzer = new SyntacticAnalyzer(lexicalAnalyzer, data, [
      [],
    ]);
  });
});
