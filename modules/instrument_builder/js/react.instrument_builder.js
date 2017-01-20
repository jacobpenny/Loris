!function(e){function t(n){if(a[n])return a[n].exports;var s=a[n]={exports:{},id:n,loaded:!1};return e[n].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t){var a=React.createClass({displayName:"LoadPane",getInitialState:function(){return{alert:""}},chooseFile:function(e){var t=e.target.files[0];this.setState({file:t,alert:""})},setAlert:function(e){this.setState({alert:e})},resetAlert:function(){this.setState({alert:""})},loadFile:function(){var e={success:this.props.loadCallback,error:this.setAlert};Instrument.load(this.state.file,e)},render:function(){var e="";switch(this.state.alert){case"success":e=React.createElement("div",{className:"alert alert-success alert-dismissible",role:"alert"},React.createElement("button",{type:"button",className:"close",onClick:this.resetAlert},React.createElement("span",{"aria-hidden":"true"},"×")),React.createElement("strong",null,"Success!")," Instrument Loaded");break;case"typeError":e=React.createElement("div",{className:"alert alert-danger alert-dismissible",role:"alert"},React.createElement("button",{type:"button",className:"close",onClick:this.resetAlert},React.createElement("span",{"aria-hidden":"true"},"×")),React.createElement("strong",null,"Error!")," Wrong file format")}return React.createElement(TabPane,this.props,React.createElement("div",{className:"col-sm-6 col-xs-12"},e,React.createElement("input",{className:"fileUpload",type:"file",id:"instfile",onChange:this.chooseFile}),React.createElement("input",{className:"btn btn-primary spacingTop",type:"button",id:"load",value:"Load Instrument",onClick:this.loadFile})))}}),n=React.createClass({displayName:"SavePane",getInitialState:function(){return{fileName:"",instrumentName:""}},loadState:function(e){this.setState({fileName:e.fileName,instrumentName:e.instrumentName})},onChangeFile:function(e){var t=e.target.value;this.setState({fileName:t})},onChangeInst:function(e){var t=e.target.value;this.setState({instrumentName:t})},render:function(){var e=this.state.fileName;return React.createElement(TabPane,this.props,React.createElement("div",{className:"form-group"},React.createElement("div",{className:"col-xs-12"},React.createElement("label",{className:"col-sm-2 control-label"},"Filename: "),React.createElement("div",{className:"col-sm-4"},React.createElement("input",{className:"form-control",type:"text",id:"filename",value:e,onChange:this.onChangeFile}))),React.createElement("div",{className:"col-xs-12 spacingTop"},React.createElement("label",{className:"col-sm-2 control-label"},"Instrument Name: "),React.createElement("div",{className:"col-sm-4"},React.createElement("input",{className:"form-control",type:"text",id:"longname",value:this.state.instrumentName,onChange:this.onChangeInst}))),React.createElement("div",{className:"col-xs-12 spacingTop"},React.createElement("div",{className:"col-xs-12 col-sm-4 col-sm-offset-2"},React.createElement("input",{className:"btn btn-primary col-xs-12",type:"submit",value:"Save",onClick:this.props.save})))))}}),s=React.createClass({displayName:"DisplayElements",getPlaceholder:function(){if(!this.placeholder){var e=document.createElement("tr");e.className="placeholder";var t=document.createElement("td");t.colSpan=2,t.appendChild(document.createTextNode("Drop here")),e.appendChild(t),this.placeholder=e}return this.placeholder},getTableRow:function(e){return"tr"!==e.tagName?$(e).closest("tr")[0]:e},dragStart:function(e){this.dragged=this.getTableRow(e.currentTarget),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/html",e.currentTarget)},dragEnd:function(e){this.dragged.style.display="table-row",this.dragged.parentNode.removeChild(this.getPlaceholder());var t=this.props.elements,a=Number(this.dragged.dataset.id),n=Number(this.over.dataset.id);a<n&&n--,"after"==this.nodePlacement&&n++,t.splice(n,0,t.splice(a,1)[0]),this.setState({data:t})},dragOver:function(e){e.preventDefault();var t=this.getTableRow(e.target);if(this.dragged.style.display="none","placeholder"!=t.className){this.over=t;var a=e.pageY-$(this.over).offset().top,n=this.over.offsetHeight/2,s=t.parentNode;a>=n?(this.nodePlacement="after",s.insertBefore(this.getPlaceholder(),t.nextElementSibling)):(this.nodePlacement="before",s.insertBefore(this.getPlaceholder(),t))}},render:function(){var e=this.props.elements.map(function(e,t){var a,n={wordWrap:"break-word"};return a=e.editing?React.createElement("tr",{"data-id":t,key:t,draggable:this.props.draggable,onDragEnd:this.dragEnd,onDragStart:this.dragStart},React.createElement("td",{className:"col-xs-2",colSpan:"3"},React.createElement(AddElement,{updateQuestions:this.props.updateElement,element:e,index:t}))):React.createElement("tr",{"data-id":t,key:t,draggable:this.props.draggable,onDragEnd:this.dragEnd,onDragStart:this.dragStart},React.createElement("td",{style:n},e.Name),React.createElement("td",{style:n},React.createElement(LorisElement,{element:e})),React.createElement("td",{style:n},React.createElement("button",{onClick:this.props.editElement.bind(this,t),className:"button"},"Edit"),React.createElement("button",{onClick:this.props.deleteElement.bind(this,t),className:"button"},"Delete"))),{row:a}}.bind(this)),t={tableLayout:"fixed"};return React.createElement("table",{id:"sortable",className:"table table-hover",style:t},React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",{className:"col-xs-2"},"Database Name"),React.createElement("th",{className:"col-xs-6"},"Question Display (Front End)"),React.createElement("th",{className:"col-xs-4"},"Edit"))),React.createElement("tbody",{onDragOver:this.dragOver},e))}}),l=React.createClass({displayName:"BuildPane",getInitialState:function(){return{Elements:[{Type:"ElementGroup",GroupType:"Page",Description:"Top",Elements:[]}],amountEditing:0,currentPage:0,elementDBNames:{}}},loadElements:function(e){var t=e[this.state.currentPage].Elements,a={};t.forEach(function(e){a[e.Name]=""}),this.setState({Elements:e,elementDBNames:a})},editElement:function(e){this.setState(function(t){var a=t.Elements,n=t.amountEditing+1,s=t.elementDBNames;return delete s[a[t.currentPage].Elements[e].Name],a[t.currentPage].Elements[e].editing=!0,{Elements:a,amountEditing:n,elementDBNames:s}})},deleteElement:function(e){this.setState(function(t){var a=t.Elements,n=t.elementDBNames;return delete n[a[t.currentPage].Elements[e].Name],a[t.currentPage].Elements.splice(e,1),{Elements:a}})},updateElement:function(e,t){return!(e.Name&&e.Name in this.state.elementDBNames)&&(this.setState(function(a){var n=a.Elements,s=a.amountEditing-1,l=a.elementDBNames;return n[a.currentPage].Elements[t]=e,e.Name&&(l[e.Name]=""),{Elements:n,amountEditing:s,elementDBNames:l}}),!0)},addQuestion:function(e){return!(e.Name&&e.Name in this.state.elementDBNames)&&(this.setState(function(t){var a=t.Elements,n=t.elementDBNames;return e.Name&&(n[e.Name]=""),a[t.currentPage].Elements.push(e),{Elements:a,elementDBNames:n}}),!0)},addPage:function(e){this.setState(function(t){var a=t.Elements,n=t.currentPage+1;return a.push({Type:"ElementGroup",GroupType:"Page",Description:e,Elements:[]}),{Elements:a,currentPage:n}})},selectPage:function(e){this.setState({currentPage:e})},render:function(){var e=0===this.state.amountEditing,t=this,a=this.state.Elements.map(function(e,a){return React.createElement("li",{onClick:t.selectPage.bind(this,a)},React.createElement("a",null,t.state.Elements[a].Description))});return React.createElement(TabPane,this.props,React.createElement("div",{className:"form-group col-xs-12"},React.createElement("label",{for:"selected-input",className:"col-xs-2 col-sm-1 control-label"},"Page:"),React.createElement("div",{className:"col-sm-4"},React.createElement("div",{className:"btn-group"},React.createElement("button",{id:"selected-input",type:"button",className:"btn btn-default dropdown-toggle","data-toggle":"dropdown"},React.createElement("span",{id:"search_concept"},this.state.Elements[this.state.currentPage].Description),React.createElement("span",{className:"caret"})),React.createElement("ul",{className:"dropdown-menu",role:"menu"},a)))),React.createElement(s,{elements:this.state.Elements[this.state.currentPage].Elements,editElement:this.editElement,deleteElement:this.deleteElement,updateElement:this.updateElement,draggable:e}),React.createElement("div",{className:"row"},React.createElement(AddElement,{updateQuestions:this.addQuestion,addPage:this.addPage})))}}),r=React.createClass({displayName:"InstrumentBuilderApp",saveInstrument:function(){Instrument.save(this.refs.savePane.state,this.refs.buildPane.state.Elements)},loadCallback:function(e,t){this.refs.savePane.loadState(t),this.refs.buildPane.loadElements(e),this.refs.loadPane.setAlert("success")},render:function(){var e=[];e.push(React.createElement(a,{TabId:"Load",ref:"loadPane",loadCallback:this.loadCallback})),e.push(React.createElement(l,{TabId:"Build",ref:"buildPane"})),e.push(React.createElement(n,{TabId:"Save",ref:"savePane",save:this.saveInstrument}));var t=[{id:"Load",label:"Load"},{id:"Build",label:"Build"},{id:"Save",label:"Save"}];return React.createElement("div",null,React.createElement(Tabs,{tabs:t,defaultTab:"Build"},e))}});RInstrumentBuilderApp=React.createFactory(r)}]);