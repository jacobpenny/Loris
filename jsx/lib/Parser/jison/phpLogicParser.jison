/* using JISON Lexical analysis with Flex pattern matching (http://dinosaur.compilertools.net/flex/flex_11.html) */

/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                                 /* skip whitespace */
"null"                              return 'null'
"true"                              return 'true'
"false"                             return 'false'
"E"                                 return 'E'
"PI"                                return 'PI'
\d+("."\d+)?\b                      return 'NUMBER'
"*"                                 return '*'
"/"                                 return '/'
"-"                                 return '-'
"+"                                 return '+'
"^"                                 return '^'
"="                                 return '='
"!"                                 return '!'
"%"                                 return '%'
"("                                 return '('
")"                                 return ')'
","                                 return ','
"<>"								return '<>'
"<="								return '<='
">="								return '>='
"<"                                 return '<'
">"                                 return '>'
"and"                               return 'and'
"or"                                return 'or'
"not"                               return 'not'
[_a-zA-Z0-9]\w*                     return 'VARIABLE'
"\""[^"]*"\""                       return 'ESTRING'
"'"[^']*"'"                         return 'STRING'
"["                                 return '['
"]"                                 return ']'
<<EOF>>                             return 'EOF'
.                                   return 'INVALID'

/lex

/* operator associations and precedence */

%left 'and' 'or'
%right 'not'
%left '=' '<' '>' '<>' '<=' '>='
%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

arguments
    : e ',' arguments
        { $$ = [$1].$3; } //
    | e
        { $$ = [$1]; }
    ;

variable
    : VARIABLE
        { $$ = yytext; }
    ;

constant
    : 'E'
        { $$ = M_E; } //
    | 'PI'
        { $$ = M_PI; } //
    ;

accessors
    : '[' variable ']' accessors
        { $$ = [$2].$4; } //
    | '[' variable '(' NUMBER ')' ']' accessors
        { $$ = [$2].$4.$7; } //
    | '[' variable '(' variable ')' ']' accessors
        { $$ = [$2].$4.$7; } //
    | '[' variable '(' NUMBER ')' ']'
        { $$ = [$2].$4; } //
    | '[' variable '(' variable ')' ']'
        { $$ = [$2].$4; } //
    | '[' variable ']'
        { $$ = [$2]; }
    ;

e
    : e '=' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'eq', 'args'=>[$1, $3]); }
    | e '<' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'lt', 'args'=>[$1, $3]); }
    | e '>' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'gt', 'args'=>[$1, $3]); }
    | e '<>' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'neq', 'args'=>[$1, $3]); }
    | e '<=' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'leq', 'args'=>[$1, $3]); }
    | e '>=' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'geq', 'args'=>[$1, $3]); }
    | e '+' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'add', 'args'=>[$1, $3]); }
    | e '-' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'sub', 'args'=>[$1, $3]); }
    | e '*' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'mul', 'args'=>[$1, $3]); }
    | e '/' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'div', 'args'=>[$1, $3]); }
    | e '^' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'pow', 'args'=>[$1, $3]); }
    | e '%' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'mod', 'args'=>[$1, $3]); }
    | e 'and' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'and', 'args'=>[$1, $3]); }
    | e 'or' e
        { $$ = array('tag'=>'BinaryOp', 'op'=>'or', 'args'=>[$1, $3]); }
    | 'not' e
        { $$ = array('tag'=>'UnaryOp', 'op'=>'not', 'args'=>[$2]); }
    | e '%'
        { $$ = array('tag'=>'UnaryOp', 'op'=>'per', 'args'=>[$1]); }
    | e '!'
        { $$ = array('tag'=>'UnaryOp', 'op'=>'fact', 'args'=>[$1]); }
    | '-' e %prec UMINUS
        { $$ = array('tag'=>'UnaryOp', 'op'=>'negate', 'args'=>[$2]); }
    | '(' e ')'
        { $$ = array('tag'=>'NestedExpression', 'args'=>[$2]); }
    | variable '(' arguments ')'
        { $$ = array('tag'=>'FuncApplication', 'args'=>[$1, $3]); }
    | "[" variable "]" accessors
        { $$ = array('tag'=>'NestedVariables', 'args'=>[$2, $4]; }
    | "[" variable "]"
        { $$ = array('tag'=>'Variable', 'args'=>[$2]; }
    | "[" variable "(" NUMBER ")" "]" accessors
        { $$ = array('tag'=>'NestedVariables', 'args'=>[$2, [$4]]); }
    | "[" variable "(" variable ")" "]" accessors
        { $$ = array('tag'=>'NestedVariables', 'args'=>[$2, [$4]]); }
    | "[" variable "(" NUMBER ")" "]"
        { $$ = array('tag'=>'NestedVariables', 'args'=>[$2, [$4]]); }
    | "[" variable "(" variable ")" "]"
        { $$ = array('tag'=>'NestedVariables', 'args'=>[$2, [$4]]); }
    | constant
        { $$ = array('tag'=>'Literal', 'args'=>[$1]); }
    | NUMBER
        { $$ = array('tag'=>'Literal', 'args'=>[Number(yytext)]); }
    | STRING
        { $$ = array('tag'=>'String', 'args'=>[yytext]); }
    | ESTRING
        { $$ = array('tag'=>'String', 'args'=>[yytext]); }
    | 'false'
        { $$ = array('tag'=>'Literal', 'args'=>[false]); }
    | 'true'
        { $$ = array('tag'=>'Literal', 'args'=>[true]); }
    | 'null'
        { $$ = array('tag'=>'Literal', 'args'=>[null]); }
    ;