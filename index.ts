import { LexicalAnalyzer } from "./Lexical";
import * as fs from "fs";

// Specify the path to the file you want to read
const filePath = "./codigo-teste-2.ssl";

// Read the file
fs.readFile(filePath, "utf8", (error, data) => {
  if (error) return console.error("Error reading the file: ", error);

  const lexicalAnalyzer = new LexicalAnalyzer(data);
  lexicalAnalyzer.run();
});
