<?php
    include 'functions.php';
    include 'parser.php';

    class Evaluator {
        static function evalAST($tree, $scope) {
            global $FUNCTIONS;
            $evalarg = function($a) use ($scope) {
                return static::evalAST($a, $scope);
            };
            switch($tree['tag']) {
                case 'String':
                    return substr((string)$tree['args'][0],1,-1);
                case 'Literal':
                    return $tree['args'][0];
                case 'Variable':
                    if (isset($scope[$tree['args'][0]])) {
                        return $scope[$tree['args'][0]];
                    }
                    throw new Exception("Unbound variable: " . $tree['args'][0]);
                case 'NestedVariable':
                    if (isset($scope[$tree['args'][0]])) {
                        $res = $scope[$tree['args'][0]];
                        $i = 0;
                        for($i; $i < count($tree['args'][1]); $i++) {
                            if (!isset($res[$tree['args'][1][$i]])) {
                                throw new Exception("Unbound sub-variable: " . $tree['args'][1][$i]);
                            }
                            $res = $res[$tree['args'][1][$i]];
                        }
                        return $res;
                    }
                    throw new Exception("Unbound variable: " . $tree['args'][0]);
                case 'FuncApplication':
                    if ($tree['args'][0] == 'if') {
                        if (static::evalAST($tree['args'][1][0], $scope)) {
                            return static::evalAST($tree['args'][1][1]);
                        }
                        return static::evalAST($tree['args'][1][2]);
                    }
                    $funcName = '_'.$tree['args'][0];
                    if (!isset($FUNCTIONS[$funcName])) {
                        throw `{$tree['args'][0]} is not a defined function.`;
                    }
                    $funcArgs = array_map($evalarg, $tree['args'][1]);
                    return $FUNCTIONS[$funcName](...$funcArgs);
                case 'NestedExpression':
                    return static::evalAST($tree['args'][0], $scope);
                case 'UnaryOp':
                    $funcName = '_'.$tree['op'];
                    return $FUNCTIONS[$funcName](static::evalAST($tree['args'][0], $scope));
                case 'BinaryOp':
                    $funcArgs = array_map($evalarg, $tree['args']);
                    $funcName = '_'.$tree['op'];
                    return $FUNCTIONS[$funcName](...$funcArgs);
            }
        }
        static function eval($expression, $scope) {
            $tree = (new Parser($expression))->parse();
            return static::evalAST($tree, $scope);
        }
    }

    // For testing:
    // php evaluator.php 'eq([x][z(0)], 33)'

    var_dump(Evaluator::eval($argv[1], array('x' => array('z' => array(33)))));
?>
