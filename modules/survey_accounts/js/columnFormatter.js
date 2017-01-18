!function(e){function n(a){if(r[a])return r[a].exports;var t=r[a]={exports:{},id:a,loaded:!1};return e[a].call(t.exports,t,t.exports,n),t.loaded=!0,t.exports}var r={};return n.m=e,n.c=r,n.p="",n(0)}({0:function(e,n,r){r(1)(r(42))},1:function(e,n){e.exports=function(e){"undefined"!=typeof execScript?execScript(e):eval.call(null,e)}},42:function(e,n){e.exports='/* exported formatColumn */\n\n/**\n * Modify behaviour of specified column cells in the Data Table component\n * @param {string} column - column name\n * @param {string} cell - cell content\n * @param {arrray} rowData - array of cell contents for a specific row\n * @param {arrray} rowHeaders - array of table headers (column names)\n * @return {*} a formated table cell for a given column\n */\nfunction formatColumn(column, cell, rowData, rowHeaders) {\n  // Create the mapping between rowHeaders and rowData in a row object.\n  var row = {};\n  rowHeaders.forEach(function (header, index) {\n    row[header] = rowData[index];\n  }, this);\n  if (column === \'URL\') {\n    var url = loris.BaseURL + "/survey.php?key=" + row.URL;\n    return React.createElement(\n      "td",\n      null,\n      React.createElement(\n        "a",\n        { href: url },\n        cell\n      )\n    );\n  }\n  return React.createElement(\n    "td",\n    null,\n    cell\n  );\n}'}});