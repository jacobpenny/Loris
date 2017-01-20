!function(e){function t(s){if(a[s])return a[s].exports;var r=a[s]={exports:{},id:s,loaded:!1};return e[s].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t){LorisElement=React.createClass({displayName:"LorisElement",render:function(){var e=this.props.element,t="";switch(e.Type){case"header":t=React.createElement("h2",null,e.Description);break;case"label":t=React.createElement("p",null,e.Description);break;case"score":t=React.createElement(StaticElement,{text:0,label:e.Description});break;case"text":t="small"===e.Options.Type?React.createElement(TextboxElement,{label:e.Description}):React.createElement(TextareaElement,{label:e.Description});break;case"select":t=e.Options.AllowMultiple?React.createElement(SelectElement,{label:e.Description,options:e.Options.Values,multiple:!0}):React.createElement(SelectElement,{label:e.Description,options:e.Options.Values});break;case"date":t=React.createElement(DateElement,{label:e.Description,minYear:e.Options.MinDate,maxYear:e.Options.MaxDate});break;case"numeric":t=React.createElement(NumericElement,{label:e.Description,min:e.Options.MinValue,max:e.Options.MaxValue})}return React.createElement("div",null,t)}}),QuestionText=React.createClass({displayName:"QuestionText",onChange:function(e){this.props.updateState({Description:e.target.value})},render:function(){var e="",t="form-group";return this.props.element.error&&this.props.element.error.questionText&&(e=React.createElement("font",{className:"form-error"},this.props.element.error.questionText),t+=" has-error"),React.createElement("div",{className:t},React.createElement("label",{className:"col-sm-2 control-label"},"Question Text: "),React.createElement("div",{className:"col-sm-6"},React.createElement("input",{className:"form-control col-xs-12",type:"text",id:"questionText",size:"75",value:this.props.element?this.props.element.Description:"",onChange:this.onChange}),e))}}),BasicOptions=React.createClass({displayName:"BasicOptions",onChange:function(e){var t=e.target.value.trim().split(" ").join("_");this.props.updateState({Name:t})},render:function(){var e="",t="form-group";return this.props.element.error&&this.props.element.error.questionName&&(e=React.createElement("font",{className:"form-error"},this.props.element.error.questionName),t+=" has-error"),React.createElement("div",null,React.createElement("div",{className:t},React.createElement("label",{className:"col-sm-2 control-label"},"Question Name: "),React.createElement("div",{className:"col-sm-6"},React.createElement("input",{className:"form-control",type:"text",id:"questionName",onChange:this.onChange,value:this.props.element?this.props.element.Name:""}),e)),React.createElement(QuestionText,{updateState:this.props.updateState,element:this.props.element}))}}),DropdownOptions=React.createClass({displayName:"DropdownOptions",getInitialState:function(){return{option:""}},onChange:function(e){this.setState({option:e.target.value})},addOption:function(){var e=this.state.option.trim();if(""==e){var t=this.state.error?this.state.error:{};return t.newSelectOption="Dropdown options cannot be empty!",void this.setState({error:t})}if(this.state.error){var t=this.state.error;delete t.newSelectOption,this.setState({error:t})}var t=Instrument.clone(this.props.element.Options),a=Instrument.Enumize(this.state.option);t.Values[a]=this.state.option,this.props.updateState({Options:t}),this.state.option=""},resetOptions:function(){temp=Instrument.clone(this.props.element.Options),temp.Values={},this.props.updateState({Options:temp})},render:function(){var e="",t=Instrument.clone(this.props.element.Options.Values),a="",s="form-group";return this.props.element.Options.AllowMultiple&&(e="multiple"),this.state.error&&this.state.error.newSelectOption&&(a=React.createElement("span",{className:"form-error"},this.state.error.newSelectOption),s+=" has-error"),React.createElement("div",null,React.createElement(BasicOptions,{updateState:this.props.updateState,element:this.props.element}),React.createElement("div",{className:s},React.createElement("label",{className:"col-sm-2 control-label"},"Dropdown Option: "),React.createElement("div",{className:"col-sm-3"},React.createElement("input",{className:"form-control",type:"text",id:"newSelectOption",value:this.state.option,onChange:this.onChange})),React.createElement("input",{className:"btn btn-default",type:"button",value:"Add option",onClick:this.addOption.bind(this,!1)}),React.createElement("input",{className:"btn btn-default",type:"button",value:"Reset",onClick:this.resetOptions}),React.createElement("div",{className:"col-sm-6 col-sm-offset-2"},a)),React.createElement("div",{className:"form-group"},React.createElement("label",{className:"col-sm-2 control-label"},"Preview: "),React.createElement("div",{className:"col-sm-2"},React.createElement("select",{multiple:e,id:"selectOptions",className:"form-control"},Object.keys(t).map(function(e){return React.createElement("option",null,t[e])})))))}}),DateOptions=React.createClass({displayName:"DateOptions",getInitialState:function(){return{dateFormat:{Date:"Standard Date",BasicDate:"Basic Date (does not include 'Not Answered' option)",MonthYear:"Month Year (does not include day of the month)"}}},componentDidMount:function(){this.props.element.Options.dateFormat=""},onChange:function(e){var t=Instrument.clone(this.props.element.Options);"datemin"===e.target.id&&e.target.value.length>0?t.MinDate=e.target.value+"-01-01":"datemax"===e.target.id&&e.target.value.length>0?t.MaxDate=e.target.value+"-12-31":"dateFormat"===e.target.id&&(t.dateFormat=e.target.value),this.props.updateState({Options:t})},render:function(){var e=this.props.element.Options.MinDate.split("-")[0],t=this.props.element.Options.MaxDate.split("-")[0],a="options form-group",s="",r=this.state.dateFormat;return this.props.element.error&&this.props.element.error.dateOption&&(s=React.createElement("span",{className:"form-error"},this.props.element.error.dateOption),a+=" has-error"),React.createElement("div",null,React.createElement(BasicOptions,{updateState:this.props.updateState,element:this.props.element}),React.createElement("div",{id:"dateoptions",className:a},React.createElement("label",{className:"col-sm-2 control-label"},"Start year: "),React.createElement("div",{className:"col-sm-2"},React.createElement("input",{className:"form-control",type:"number",id:"datemin",min:"1900",max:"2100",value:e,onChange:this.onChange}),s),React.createElement("label",{className:"col-sm-2 control-label"},"End year: "),React.createElement("div",{className:"col-sm-2"},React.createElement("input",{className:"form-control",type:"number",id:"datemax",min:"1900",max:"2100",onChange:this.onChange,value:t}))),React.createElement("div",{className:"form-group"},React.createElement("label",{className:"col-sm-2 control-label"},"Date Format: "),React.createElement("div",{className:"col-sm-6"},React.createElement("select",{id:"dateFormat",className:"form-control",onChange:this.onChange},Object.keys(r).map(function(e){return React.createElement("option",{value:e},r[e])})))))}}),NumericOptions=React.createClass({displayName:"NumericOptions",onChange:function(e){var t=Instrument.clone(this.props.element.Options);"numericmin"===e.target.id?t.MinValue=parseInt(e.target.value):"numericmax"===e.target.id&&(t.MaxValue=parseInt(e.target.value)),this.props.updateState({Options:t})},render:function(){var e="",t="options form-group";return this.props.element.error&&this.props.element.error.numeric&&(e=React.createElement("span",{className:"form-error"},this.props.element.error.numeric),t+="options form-group has-error"),React.createElement("div",null,React.createElement(BasicOptions,{updateState:this.props.updateState,element:this.props.element}),React.createElement("div",{id:"numericoptions",className:t},React.createElement("label",{className:"col-sm-2 control-label"},"Min: "),React.createElement("div",{className:"col-sm-2"},React.createElement("input",{className:"form-control",type:"number",id:"numericmin",onChange:this.onChange,value:this.props.element.Options.MinValue})),React.createElement("label",{className:"col-sm-2 control-label"},"Max: "),React.createElement("div",{className:"col-sm-2"},React.createElement("input",{className:"form-control",type:"number",id:"numericmax",onChange:this.onChange,value:this.props.element.Options.MaxValue})),React.createElement("div",{className:"col-sm-offset-2 col-sm-10"},e)))}}),ListElements=React.createClass({displayName:"ListElements",selectType:function(e,t){var a={selected:{id:e,value:t}},s=!1,r="small";switch(e){case"textarea":r="large";case"textbox":a.Options={Type:r};break;case"multiselect":s=!0;case"dropdown":a.Options={Values:{},AllowMultiple:s};break;case"date":a.Options={MinDate:"",MaxDate:""};break;case"numeric":a.Options={MinValue:0,MaxValue:0}}this.props.updateState(a)},render:function(){return React.createElement("div",{className:"form-group"},React.createElement("label",{for:"selected-input",className:"col-sm-2 control-label"},"Question Type:"),React.createElement("div",{className:"col-sm-4"},React.createElement("div",{className:"btn-group"},React.createElement("button",{id:"selected-input",type:"button",className:"btn btn-default dropdown-toggle","data-toggle":"dropdown"},React.createElement("span",{id:"search_concept"},this.props.value," "),React.createElement("span",{className:"caret"})),React.createElement("ul",{className:"dropdown-menu",role:"menu"},React.createElement("li",null,React.createElement("div",{className:"col-sm-12"},React.createElement("h5",{className:""},"Information"))),React.createElement("li",{onClick:this.selectType.bind(this,"header","Header")},React.createElement("a",{id:"header",className:"option",title:"Centered, header information"},"Header")),React.createElement("li",{onClick:this.selectType.bind(this,"label","Label")},React.createElement("a",{id:"label",className:"option",title:"Unemphasized display text"},"Label")),React.createElement("li",{onClick:this.selectType.bind(this,"score","Scored Field")},React.createElement("a",{id:"scored",className:"option",title:"Column which stores calculated data"},"Scored Field")),React.createElement("li",{className:"divider"}),React.createElement("li",null,React.createElement("div",{className:"col-sm-12"},React.createElement("h5",{className:""},"Data entry"))),React.createElement("li",{onClick:this.selectType.bind(this,"textbox","Textbox")},React.createElement("a",{id:"textbox",className:"option",title:"Text box for user data entry"},"Textbox")),React.createElement("li",{onClick:this.selectType.bind(this,"textarea","Textarea")},React.createElement("a",{id:"textarea",className:"option",title:"Larger text area for data entry"},"Textarea")),React.createElement("li",{onClick:this.selectType.bind(this,"dropdown","Dropdown")},React.createElement("a",{id:"dropdown",className:"option",title:"Dropdown menu for users to select data from"},"Dropdown")),React.createElement("li",{onClick:this.selectType.bind(this,"multiselect","Multiselect")},React.createElement("a",{id:"multiselect",className:"option",title:"Data entry where multiple options may be selected"},"Multiselect")),React.createElement("li",{onClick:this.selectType.bind(this,"date","Date")},React.createElement("a",{id:"date",className:"option",title:"User data entry of a date"},"Date")),React.createElement("li",{onClick:this.selectType.bind(this,"numeric","Numeric")},React.createElement("a",{id:"numeric",className:"option",title:"User data entry of a number"},"Numeric")),React.createElement("li",{className:"divider"}),React.createElement("li",null,React.createElement("div",{className:"col-sm-12"},React.createElement("h5",{className:""},"Formatting"))),React.createElement("li",{onClick:this.selectType.bind(this,"line","Blank Line")},React.createElement("a",{id:"line",className:"option",title:"Empty line"},"Blank Line")),React.createElement("li",{onClick:this.selectType.bind(this,"page-break","Page Break")},React.createElement("a",{id:"page-break",className:"option",title:"Start a new page"},"Page Break"))))))}}),AddElement=React.createClass({displayName:"AddElement",getInitialState:function(){var e;return e=this.props.element?{Options:Instrument.clone(this.props.element.Options),Description:Instrument.clone(this.props.element.Description),Name:Instrument.clone(this.props.element.Name),selected:Instrument.clone(this.props.element.selected)}:{Options:{},Description:"",Name:"",selected:{id:"",value:"Select One"}}},updateState:function(e){this.setState(e)},addQuestion:function(){var e,t=this.state.selected.id,a=this.state.Description,s=this.state.Name,r=!1;if(s&&s.indexOf("status")>-1)return void alert("Question name can't contain 'status' as part of the name!");if(!t)return void alert("No element type selected");if("date"==t){var n=this.state.Options.MinDate,i=this.state.Options.MaxDate,l=Date.parse(n),o=Date.parse(i);if(isNaN(l)&&""!=n||isNaN(o)&&""!=i){var c=this.state.error?this.state.error:{};c.dateOption="Invalid date provided",this.setState({error:c}),r=!0}if(l>o&&""!=n&&""!=i){var c=this.state.error?this.state.error:{};c.dateOption="End year append befor start year",this.setState({error:c}),r=!0}if(!r&&this.state.error){var c=this.state.error;delete c.dateOption,this.setState({error:c})}}if("numeric"==t){var n=this.state.Options.MinValue,i=this.state.Options.MaxValue;if(n>=i){var c=this.state.error?this.state.error:{};c.numeric="Max value must be larger than min value",this.setState({error:c}),r=!0}if(!r&&this.state.error){var c=this.state.error;delete c.numeric,this.setState({error:c})}}if(""==a&&"line"!=t){var c=this.state.error?this.state.error:{};"page-break"==t?c.questionText="Must use question text as page header":c.questionText="No question text specified",this.setState({error:c}),r=!0}if(!r&&this.state.error){var c=this.state.error;delete c.questionText,this.setState({error:c})}if(""==s&&"header"!=t&&"label"!=t&&"line"!=t&&"page-break"!=t){var c=this.state.error?this.state.error:{};c.questionName="Must specifiy name for database to save value into",this.setState({error:c}),r=!0}else if(this.state.error){var c=this.state.error;delete c.questionName,this.setState({error:c})}if(!r){switch(t){case"header":case"label":s="";break;case"textbox":case"textarea":t="text";break;case"dropdown":case"multiselect":t="select";break;case"page-break":return void this.props.addPage(a)}delete this.state.error;var e={Type:t,Description:a,Name:s,Options:this.state.Options,selected:this.state.selected};r="undefined"!=typeof this.props.index?!this.props.updateQuestions(e,this.props.index):!this.props.updateQuestions(e),r&&this.setState(function(e){var t=e.error?e.error:{};return t.questionName="Duplicate question name",{error:t}})}},addOption:function(e){this.setState(function(t){var a=t.options,s=e?$("#newmultiSelectOption").val():$("#newSelectOption").val();return a.push(s),{options:a}})},resetOptions:function(){this.setState({options:[]})},render:function(){var e,t,a="";switch(this.state.selected.id){case"header":case"label":case"page-break":e=React.createElement(QuestionText,{updateState:this.updateState,element:this.state});break;case"score":case"textbox":case"textarea":e=React.createElement(BasicOptions,{updateState:this.updateState,element:this.state});break;case"multiselect":case"dropdown":e=React.createElement(DropdownOptions,{updateState:this.updateState,element:this.state});break;case"date":e=React.createElement(DateOptions,{updateState:this.updateState,element:this.state});break;case"numeric":e=React.createElement(NumericOptions,{updateState:this.updateState,element:this.state});break;case"defualt":}return this.props.element?t=React.createElement("input",{className:"btn btn-default",type:"button",value:"Edit Row",onClick:this.addQuestion}):(a=React.createElement("h2",null,"Add Question"),t=React.createElement("input",{className:"btn btn-default",type:"button",value:"Add Row",onClick:this.addQuestion})),React.createElement("div",{className:"col-xs-12"},a,React.createElement("div",{className:"form-horizontal",role:"form"},React.createElement(ListElements,{updateState:this.updateState,value:this.state.selected.value}),e,React.createElement("div",{className:"form-group"},React.createElement("div",{className:"col-sm-offset-2 col-sm-10"},t))))}})}]);