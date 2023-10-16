import { LexicalAnalyzer } from './Lexical';
import * as fs from 'fs';
import { SyntacticAnalyzer } from './Syntactic';
import { SemanticAnalyzer } from './Semantic/index';
import { parse } from 'csv-parse';

const codeFilePath = './codigo-teste-2.ssl';
const tableFilePath = './action_table.csv';

fs.readFile(codeFilePath, 'utf8', (error, data) => {
	if (error) return console.error('Error reading the code file: ', error);

	// Execute the lexical analyzer
	const lexicalAnalyzer = new LexicalAnalyzer(data);
	lexicalAnalyzer.execute();

	fs.readFile(tableFilePath, 'utf8', async (aError, aData) => {
		if (aError) return console.error('Error reading the actions table file: ', aError);

		const parser = parse(aData, {
			cast: true, // If true, the parser will attempt to convert input string to native types
			delimiter: '\t', // Set the field delimiter. One character only, defaults to comma
			trim: true, // If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false
		});

		const actionsTable: string[][] = [];

		for await (const row of parser) {
			actionsTable.push((row as string[]).map((value) => value + ''));
		}

		// Execute the synctatic analyzer (witch will also execute the lexical analyzer and the semantic analyzer)
		// FIXME: transform the aData in array of array of strings
		const semanticAnalyzer = new SemanticAnalyzer(lexicalAnalyzer, data);
		const synctaticAnalyzer = new SyntacticAnalyzer(
			lexicalAnalyzer,
			semanticAnalyzer,
			data,
			actionsTable,
		);
		synctaticAnalyzer.execute();
	});
});
