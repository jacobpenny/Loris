import Functions from './Functions';
import { parser } from './logicParser';


function evalAST(tree, scope) {
  switch(tree.tag) {
    case 'String': {
      return String(tree.args[0].slice(1,-1));
    }
    case 'Literal': {
      return tree.args[0];
    }
    case 'Variable': {
      if (typeof scope[tree.args[0]] === 'undefined') {
        throw `Unbound variable: ${tree.args[0]}`;
      }
      return scope[tree.args[0]];
    }
    case 'NestedVariables': {
      if (typeof scope[tree.args[0]] === 'undefined') {
        throw `Unbound variable: ${tree.args[0]}`;
      }
      var res = scope[tree.args[0]];
      for (var i = 0; i < tree.args[1].length; i++) {
        if (typeof res[tree.args[1][i]] === 'undefined') {
          throw `Unbound sub-variable: ${tree.args[1][i]}`;
        }
        res = res[tree.args[1][i]];
      }
      return res;
    }
    case 'FuncApplication': {
      if (tree.args[0] === 'if') {
        if (evalAST(tree.args[1][0], scope)) {
          return evalAST(tree.args[1][1],scope);
        }
        return evalAST(tree.args[1][2],scope);
      }
      if (!Functions[tree.args[0]]) {
        throw `'${tree.args[0]}' is not a defined function.`;
      }
      const funcArgs = tree.args[1].map(ast => evalAST(ast, scope));
      return Functions[tree.args[0]](...funcArgs);
    }
    case 'NestedExpression': {
      return evalAST(tree.args[0], scope);
    }
    case 'UnaryOp': {
      return Functions[tree.op](evalAST(tree.args[0],scope));
    }
    case 'BinaryOp': {
      const funcArgs = tree.args.map(ast => evalAST(ast, scope));
      return Functions[tree.op](...funcArgs);
    }
  }
}

export default function Evaluator(stringExpression, scope = {}) {
  const tree = parser.parse(stringExpression);
  return evalAST(tree, scope);
}