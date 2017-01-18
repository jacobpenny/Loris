!function(n){function e(a){if(t[a])return t[a].exports;var r=t[a]={exports:{},id:a,loaded:!1};return n[a].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var t={};return e.m=n,e.c=t,e.p="",e(0)}({0:function(n,e,t){t(1)(t(38))},1:function(n,e){n.exports=function(n){"undefined"!=typeof execScript?execScript(n):eval.call(null,n)}},38:function(n,e){n.exports='/* exported formatColumn */\n\n/**\n * Modify behaviour of specified column cells in the Data Table component\n * @param {string} column - column name\n * @param {string} cell - cell content\n * @param {arrray} rowData - array of cell contents for a specific row\n * @param {arrray} rowHeaders - array of table headers (column names)\n * @return {*} a formated table cell for a given column\n */\nfunction formatColumn(column, cell, rowData, rowHeaders) {\n  if (loris.hiddenHeaders.indexOf(column) > -1) {\n    return null;\n  }\n  // Create the mapping between rowHeaders and rowData in a row object.\n  var row = {};\n  rowHeaders.forEach(function (header, index) {\n    row[header] = rowData[index];\n  }, this);\n  var resolutionStatusStyle;\n  var resolutionStatus;\n  var fontColor = { color: "#FFFFFF" };\n  var patientname = row.PatientName;\n  var uid = row.SeriesUID;\n  var url;\n\n  if (column === \'Resolution Status\') {\n    switch (row["Resolution Status"]) {\n      case "unresolved":\n        resolutionStatusStyle = "label-danger";\n        resolutionStatus = \'Unresolved\';\n        break;\n\n      case "reran":\n        resolutionStatusStyle = "label-success";\n        resolutionStatus = \'Reran\';\n        break;\n\n      case "emailed":\n        resolutionStatusStyle = "label-info";\n        resolutionStatus = \'Emailed site/pending\';\n        break;\n\n      case "rejected":\n        resolutionStatusStyle = "label-danger";\n        resolutionStatus = \'Rejected\';\n        break;\n\n      case "inserted":\n        resolutionStatusStyle = "label-warning";\n        resolutionStatus = \'Inserted\';\n        break;\n\n      case "other":\n        resolutionStatusStyle = "label-primary";\n        resolutionStatus = \'Other\';\n        break;\n\n      case "inserted_flag":\n        resolutionStatusStyle = "label-default";\n        resolutionStatus = \'Inserted with flag\';\n        break;\n\n      /* no default */\n\n    }\n\n    return React.createElement(\n      "td",\n      { className: resolutionStatusStyle, style: fontColor },\n      resolutionStatus\n    );\n  }\n  if (column === "Problem" && row.Problem === "Protocol Violation") {\n    url = loris.BaseURL + "/mri_violations/?submenu=mri_protocol_check_violations&PatientName=" + patientname + "&SeriesUID=" + uid;\n    return React.createElement(\n      "td",\n      null,\n      React.createElement(\n        "a",\n        { href: url,\n          className: "mri_violations",\n          id: "mri_protocol_check_violations",\n          "data-patientname": patientname,\n          "data-seriesuid": uid\n        },\n        "Protocol Violation"\n      )\n    );\n  }\n  if (column === "Problem" && row.Problem === "Could not identify scan type") {\n    url = loris.BaseURL + "/mri_violations/?submenu=mri_protocol_violations&PatientName=" + patientname + "&SeriesUID=" + uid;\n    return React.createElement(\n      "td",\n      null,\n      React.createElement(\n        "a",\n        { href: url,\n          className: "mri_violations",\n          id: "mri_protocol_violations",\n          "data-patientname": patientname,\n          "data-seriesuid": uid\n        },\n        "Could not identify scan type"\n      )\n    );\n  }\n  return React.createElement(\n    "td",\n    null,\n    cell\n  );\n}'}});