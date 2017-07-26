# ZAIN Rules

The parser provides a human readable syntax for front end equation building, real-time calculations, and back end validation. The syntax can be used to determine whether instrument fields are shown, hidden (survey), required, as well as to perform real-time scoring or branching logic calculations while referencing other fields or subject meta-data.

Fun features: infinite variable nesting, easily managed evaluation, human readable syntax, AST evaluation, fraction factorials, variance and standard deviation, date calculations, boolean operations, type checking and much more.

Putting the fun in functions: developers can easily add or change functions without editing syntax or actually knowing how a parser works.

This ReadMe breaks down the different parts of the Parser and lists syntax rules.

Note that this parser is made up of two separate components: a JS parser and a PHP parser, both of which use the same syntax detailed below.

# Prerequisites for Development

 * [Jison](jison.org) (only required for changes in syntax)

 Note that end users do not require Jison, only the Jison-generated parser file.
 
# Development and Use
NOTE: Please make sure all changes are mirrored on both the JS and PHP sides of the parser. Discrepancies will cause more headaches than you or I wish to deal with. Integration tests to come.

### Syntax and Operator Changes
Changing syntax (or adding unary/binary operators) requires changes to `jison/logicParser.jison` as well as `php/lexer.php` and `php/parser.php`.

### Jison/JS Specifics
Tokens are defined at the top, precedence and assertions are set below that, 
and finally the grammar itself is defined below that.
The output is a simple object defining a tag, operation, and arguments. `tag` indicates the type of operation to be handled in `Evaluator.js`. `op` indicates the operation defined in `Functions.js`. Lastly, `args` defines the arguments of the operation as objects, which allows nested operations.
See Jison documentation for grammar and Flex pattern matching specifications.

After your changes are made run `jison jison/logicParser.jison` and replace `js/logicParser.js` with the output file.

### PHP Specifics
Tokens are defined in `lexer.php`. Precedence and assertions are defined by the order of parsing functions in `parser.php`. The grammar is defined in `lexer.php`. Similarly to JS, an array defining `tag`, `op`, and `args` is output to `evaluator.php`.

### Function Changes
To add or edit functions, simply edit `js/Functions.js` and `php/functions.php`.

### Evaluator Changes
To add new types of operations, add a case to the switch statement in `js/Evaluator.js` and `php/evaluator.php`.

### Unit Testing
JS tests can be added to `Loris/test/js-tests/Parser.test.js`. Run tests with `npm run tests:unit:js:watch`.
PHP tests can be added to `Loris/test/unittests/ParserTest.php`. Run tests with `Loris/vendor/bin/phpunit --configuration phpunit.xml --testsuite 'PHPParserTest'`.

### Use
At the top of your JS file add `import { Evaluator } from 'Parser';` (change the path based on your directory location).
Call `Evaluator(LOGIC_STRING, SCOPE)` to evaluate an equation.

At the top of your PHP file add `include 'Parser/php/evaluator.php';`. 
Call the evaluator with `Evaluator::evaluate($equation, $this->scope);`.

# Syntax
Note that all whitespace (spaces or tabs) is ignored in the parser.

### Value Inputs
| Type              	| Syntax                 	| Notes                                              	|
|-------------------	|------------------------	|----------------------------------------------------	|
| number            	| 1; 900; 123.456          	|                                                    	|
| text              	| "this is my text!_123" 	| empty text is supported; ' can be used instead of " 	|
| variable          	| [my_variable_name]<br>[nested_variable(array_access)]<br>[my_var][nested_var]|                                                |
| nested expression 	| (expression)           	|                                                    	|

### Constants
| Constant           	| Syntax 	|
|--------------------	|--------	|
| null               	| null   	|
| true               	| true   	|
| false              	| false  	|
| Euler's number (e) 	| E      	|
| pi                 	| PI     	|

### Numerical Operations
| Operation 	| Syntax 	| Notes                                                             	|
|-----------	|--------	|--------------------------------------------------------------------   |
| add       	| a + b  	|                                                                   	|
| subtract  	| a - b  	|                                                                    	|
| negate    	| - a    	|                                                                    	|
| multiply  	| a * b  	|                                                                     	|
| divide    	| a / b  	| cannot divide by 0                                                	|
| exponent  	| a ^ b  	|                                                                     	|
| percentage  	| a %   	| divides the value of a by 100                                         |
| factorial  	| a !   	| returns a factorial; supports 0 or positive numbers divisible by 0.5  |

### Boolean/Comparison Operations (returns true or false)
| Operation        	| Syntax  	| Notes                            	|
|------------------	|---------	|----------------------------------	|
| equivalency      	| a = b   	|                                  	|
| inequivalency    	| a <> b  	|                                  	|
| greater than     	| a > b   	|                                  	|
| less than        	| a < b   	|                                  	|
| greater or equal 	| a >= b  	|                                  	|
| less or equal    	| a <= b  	|                                  	|
| and              	| a and b 	| returns true if a and b are true 	|
| or               	| a or b  	| returns true if a or b is true   	|
| not              	| not a   	| returns true if a is false       	|

### If Logic
| Operation 	| Syntax       	| Notes                                                                            	|
|-----------	|--------------	|----------------------------------------------------------------------------------	|
| if        	| if(cond,x,y) 	| If the condition 'cond' evaluates to true, x is returned. If not, y is returned. 	|

### Functions
| Operation          	| Syntax               	| Notes                                                                                	|
|--------------------	|----------------------	|--------------------------------------------------------------------------------------	|
| not a number       	| isNaN(a)             	| returns true if a is not a number                                                    	|
| modulo             	| mod(a, b)            	| returns the remainder of a / b                                                       	|
| round              	| round(a, b)          	| rounds a to b decimal places; note all rounding functions support trailing 0s        	|
| round up           	| roundup(a, b)        	| rounds a up to b decimal places                                                      	|
| round down         	| rounddown(a,b)       	| rounds a down to b decimal places                                                    	|
| square root        	| sqrt(a)              	|                                                                                      	|
| absolute value     	| abs(a)               	| returns the positive value of a                                                      	|
| minimum            	| min(a,b,c,d...)      	| returns the smallest value of its arguments                                          	|
| maximum            	| max(a,b,c,d...)      	| returns the largest value of its arguments                                           	|
| mean               	| mean(a,b,c,d...)     	| returns the average value of its arguments                                           	|
| median             	| median(a,b,c,d...)   	| sorts its arguments in ascending order and returns the median                        	|
| sum                	| sum(a,b,c,d...)      	| returns the sum of its arguments                                                     	|
| product            	| product(a,b,c,d...)  	| returns the product of its arguments                                                 	|
| variance           	| variance(a,b,c,d...) 	| returns the population variance of its arguments                                     	|
| standard deviation 	| stdev(a,b,c,d...)    	| returns the population standard deviation (square root of variance) of its arguments 	|

### Date Operations
| Operation       	| Syntax                                        	|
|-----------------	|-----------------------------------------------	|
| date difference 	| datediff(date1, date2, units, signed)         	|

| Argument     	| Syntax                                	| Notes                                                                                                                                     	|
|--------------	|---------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------	|
| date         	| "YYYY-MM-DD" 	| YMD is the only accepted format (ISO standard)                                           |
| units        	| "y","m","d"               	| specifies the return value unit: years, months, days, |
| signed       	| true/false                            	| if true, negative differences will be allowed. if false, the difference will always be positive                                           	|
| return value 	|                                       	| returns date1 - date 2 in the specified unit                                                                                              	|
