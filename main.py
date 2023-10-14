from Lexical.analyzer import Lexical_Analysis
from Syntactic.analyzer import Syntactic_Analysis

file = open('codigo-teste-2.ssl', 'r', encoding='utf-8')

lexical = Lexical_Analysis(file)
lexical.run()

lexical = Lexical_Analysis(file)
syntactic = Syntactic_Analysis(lexical)
syntactic.parse()

file.close()
