!function(e){function t(s){if(a[s])return a[s].exports;var r=a[s]={exports:{},id:s,loaded:!1};return e[s].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t,a){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}var r=a(6),n=s(r);$(function(){var e=QueryString.get(),t=React.createElement("div",{className:"page-issue-tracker"},React.createElement(n.default,{Module:"issue_tracker",DataURL:loris.BaseURL+"/issue_tracker/ajax/EditIssue.php?action=getData&issueID="+e.issueID,action:loris.BaseURL+"/issue_tracker/ajax/EditIssue.php?action=edit"}));ReactDOM.render(t,document.getElementById("lorisworkspace"))})},,,,,,function(e,t,a){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var s=t[a];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,a,s){return a&&e(t.prototype,a),s&&e(t,s),t}}(),l=a(7),c=s(l),u=function(e){function t(e){r(this,t);var a=n(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={Data:[],formData:{},submissionResult:null,errorMessage:null,isLoaded:!1,isNewIssue:!1,issueID:0},a.getFormData=a.getFormData.bind(a),a.handleSubmit=a.handleSubmit.bind(a),a.setFormData=a.setFormData.bind(a),a.isValidForm=a.isValidForm.bind(a),a.showAlertMessage=a.showAlertMessage.bind(a),a}return i(t,e),o(t,[{key:"componentDidMount",value:function(){this.getFormData()}},{key:"render",value:function(){if(this.state.error)return React.createElement("div",{className:"alert alert-danger text-center"},React.createElement("strong",null,this.state.error));if(!this.state.isLoaded)return React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}));var e=this.state.Data.hasEditPermission||this.state.Data.isOwnIssue||this.state.isNewIssue,t=void 0,a=void 0,s=void 0,r=void 0,n=void 0,i=void 0,o=this.state.issueData.watching;this.state.isNewIssue?(t="Create New Issue",a="Never!",s="No-one!",r="Sometime Soon!",n="Submit Issue",i="Description"):(t="Edit Issue #"+this.state.issueData.issueID,a=this.state.issueData.lastUpdate,s=this.state.issueData.lastUpdatedBy,r=this.state.issueData.dateCreated,n="Update Issue",i="New Comment");var l=this.state.isNewIssue||React.createElement(c.default,{commentHistory:this.state.issueData.commentHistory}),u=void 0,m=void 0;return this.state.isNewIssue||(u=React.createElement("div",{className:"row"},React.createElement("div",{className:"col-md-6"},React.createElement(StaticElement,{name:"lastUpdate",label:"Last Update: ",ref:"lastUpdate",text:a})),React.createElement("div",{className:"col-md-6"},React.createElement(StaticElement,{name:"lastUpdatedBy",label:"Last Updated By: ",ref:"lastUpdatedBy",text:s})),React.createElement("div",{className:"col-md-6"},React.createElement(StaticElement,{name:"dateCreated",label:"Date Created: ",ref:"dateCreated",text:r})),React.createElement("div",{className:"col-md-6"},React.createElement(StaticElement,{name:"reporter",label:"Reporter: ",ref:"reporter",text:this.state.issueData.reporter}))),m=React.createElement(StaticElement,{name:"description",label:"Description",ref:"description",text:this.state.issueData.desc})),React.createElement("div",null,React.createElement(FormElement,{name:"issueEdit",onSubmit:this.handleSubmit,ref:"form"},React.createElement("h3",null,t),u,React.createElement(TextboxElement,{name:"title",label:"Title",onUserInput:this.setFormData,ref:"title",value:this.state.formData.title,disabled:!e,required:!0}),m,React.createElement(SelectElement,{name:"assignee",label:"Assignee",emptyOption:!0,options:this.state.Data.assignees,onUserInput:this.setFormData,ref:"assignee",disabled:!e,value:this.state.formData.assignee,required:!0}),React.createElement(SelectElement,{name:"centerID",label:"Site",emptyOption:!0,options:this.state.Data.sites,onUserInput:this.setFormData,ref:"centerID",disabled:!e,value:this.state.formData.centerID}),React.createElement(SelectElement,{name:"status",label:"Status",emptyOption:!1,options:this.state.Data.statuses,onUserInput:this.setFormData,ref:"status",disabled:!e,value:this.state.formData.status}),React.createElement(SelectElement,{name:"priority",label:"Priority",emptyOption:!1,options:this.state.Data.priorities,onUserInput:this.setFormData,ref:"priority",required:!1,disabled:!e,value:this.state.formData.priority}),React.createElement(SelectElement,{name:"category",label:"Category",emptyOption:!0,options:this.state.Data.categories,onUserInput:this.setFormData,ref:"category",disabled:!e,value:this.state.formData.category}),React.createElement(SelectElement,{name:"module",label:"Module",emptyOption:!0,options:this.state.Data.modules,onUserInput:this.setFormData,ref:"module",disabled:!e,value:this.state.formData.module}),React.createElement(TextboxElement,{name:"PSCID",label:"PSCID",onUserInput:this.setFormData,ref:"PSCID",disabled:!e,value:this.state.formData.PSCID}),React.createElement(TextboxElement,{name:"visitLabel",label:"Visit Label",onUserInput:this.setFormData,ref:"visitLabel",disabled:!e,value:this.state.formData.visitLabel}),React.createElement(SelectElement,{name:"watching",label:"Watching?",emptyOption:!1,options:{No:"No",Yes:"Yes"},onUserInput:this.setFormData,ref:"watching",value:o}),React.createElement(SelectElement,{name:"othersWatching",label:"Add others to watching?",emptyOption:!0,options:this.state.Data.otherWatchers,onUserInput:this.setFormData,ref:"watching",multiple:!0,value:this.state.formData.othersWatching}),React.createElement(TextareaElement,{name:"comment",label:i,onUserInput:this.setFormData,ref:"comment",value:this.state.formData.comment}),React.createElement(ButtonElement,{label:n})),l)}},{key:"getFormData",value:function(){$.ajax(this.props.DataURL,{dataType:"json",success:function(e){this.setState({Data:e,isLoaded:!0,issueData:e.issueData,formData:e.issueData,isNewIssue:!e.issueData.issueID})}.bind(this),error:function(e){this.setState({error:"An error occurred when loading the form!\n Error: "+e.status+" ("+e.statusText+")"})}.bind(this)})}},{key:"handleSubmit",value:function(e){if(e.preventDefault(),!this.state.submissionResult||!this.state.isNewIssue){this.setState({submissionResult:"pending"});var t=this.state.formData,a=this.refs,s=new FormData;if(this.isValidForm(a,t)){for(var r in t)""!==t[r]&&s.append(r,t[r]);$.ajax({type:"POST",url:this.props.action,data:s,cache:!1,dataType:"json",contentType:!1,processData:!1,success:function(e){var t="success",a=this.state.isNewIssue?"You will be redirected to main page in 2 seconds!":"";this.showAlertMessage(t,a),this.setState({submissionResult:"success",issueID:e.issueID})}.bind(this),error:function(e){console.error(e),this.setState({submissionResult:"error"});var t="error",a="Failed to submit issue :(";this.showAlertMessage(t,a)}.bind(this)})}}}},{key:"setFormData",value:function(e,t){var a=this.state.formData;a[e]=t,this.setState({formData:a})}},{key:"isValidForm",value:function e(t,a){var e=!0,s={title:null,assignee:null};return Object.keys(s).map(function(r){a[r]?s[r]=a[r]:t[r]&&(t[r].props.hasError=!0,e=!1)}),this.forceUpdate(),e}},{key:"showAlertMessage",value:function(e,t){var a="success",s="Issue updated!",r=t||"",n=null,i=!0,o=function(){this.setState({submissionResult:null})};"success"===e&&this.state.isNewIssue?(s="Issue created!",n=2e3,i=!1,o=function(){this.setState({formData:{},submissionResult:null}),window.location.assign("/issue_tracker")}):"error"===e&&(a="error",s="Error!"),swal({title:s,type:a,text:r,timer:n,allowOutsideClick:!1,allowEscapeKey:!1,showConfirmButton:i},o.bind(this))}}]),t}(React.Component);u.propTypes={DataURL:React.PropTypes.string.isRequired,action:React.PropTypes.string.isRequired},t.default=u},function(e,t){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var a=0;a<t.length;a++){var s=t[a];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,a,s){return a&&e(t.prototype,a),s&&e(t,s),t}}(),i=function(e){function t(e){a(this,t);var r=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={collapsed:!0},r.toggleCollapsed=r.toggleCollapsed.bind(r),r}return r(t,e),n(t,[{key:"toggleCollapsed",value:function(){this.setState({collapsed:!this.state.collapsed})}},{key:"render",value:function(){var e=[],t=this.state.collapsed?"Show Comment History":"Hide Comment History",a=this.props.commentHistory;for(var s in a)if(a.hasOwnProperty(s)){var r=" updated the "+a[s].fieldChanged+" to ";"comment"===a[s].fieldChanged&&(r=" commented "),e.push(React.createElement("div",{key:"comment_"+s},"[",a[s].dateAdded,"]",React.createElement("b",null," ",a[s].addedBy),r,React.createElement("i",null," ",a[s].newValue)))}return React.createElement("div",null,React.createElement("div",{className:"btn btn-primary",onClick:this.toggleCollapsed,"data-toggle":"collapse","data-target":"#comment-history",style:{margin:"10px 0"}},t),React.createElement("div",{id:"comment-history",className:"collapse"},e))}}]),t}(React.Component);t.default=i}]);
//# sourceMappingURL=index.js.map