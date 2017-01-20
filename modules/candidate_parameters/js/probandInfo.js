!function(e){function t(r){if(a[r])return a[r].exports;var n=a[r]={exports:{},id:r,loaded:!1};return e[r].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var a=React.createClass({displayName:"ProbandInfo",getInitialState:function(){return{genderOptions:{Male:"Male",Female:"Female"},Data:[],formData:{},updateResult:null,errorMessage:null,isLoaded:!1,loadedData:0}},componentDidMount:function(){var e=this;$.ajax(this.props.dataURL,{dataType:"json",xhr:function t(){var t=new window.XMLHttpRequest;return t.addEventListener("progress",function(t){e.setState({loadedData:t.loaded})}),t},success:function(t){var a={ProbandGender:t.ProbandGender,ProbandDoB:t.ProbandDoB,ProbandDoB2:t.ProbandDoB};e.setState({formData:a,Data:t,isLoaded:!0})},error:function(t,a,r){e.setState({error:"An error occurred when loading the form!"})}})},setFormData:function(e,t){var a=this.state.formData;a[e]=t,this.setState({formData:a})},onSubmit:function(e){e.preventDefault()},render:function(){if(!this.state.isLoaded)return void 0!==this.state.error?React.createElement("div",{className:"alert alert-danger text-center"},React.createElement("strong",null,this.state.error)):React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}));var e=!0,t=null;loris.userHasPermission("candidate_parameter_edit")&&(e=!1,t=React.createElement(ButtonElement,{label:"Update"}));var a=!1,r=!1;null!==this.state.formData.ProbandGender&&(a=!0),null!==this.state.formData.ProbandDoB&&(r=!0);var n="",s="alert text-center hide";if(this.state.updateResult)if("success"===this.state.updateResult)s="alert alert-success text-center",n="Update Successful!";else if("error"===this.state.updateResult){var o=this.state.errorMessage;s="alert alert-danger text-center",n=o?o:"Failed to update!"}return React.createElement("div",{class:"row"},React.createElement("div",{className:s,role:"alert",ref:"alert-message"},n),React.createElement(FormElement,{name:"probandInfo",onSubmit:this.handleSubmit,ref:"form",class:"col-md-6"},React.createElement(StaticElement,{label:"PSCID",text:this.state.Data.pscid}),React.createElement(StaticElement,{label:"DCCID",text:this.state.Data.candID}),React.createElement(SelectElement,{label:"Proband Gender",name:"ProbandGender",options:this.state.genderOptions,value:this.state.Data.ProbandGender,onUserInput:this.setFormData,ref:"ProbandGender",disabled:e,required:!0}),React.createElement(DateElement,{label:"DoB Proband",name:"ProbandDoB",value:this.state.Data.ProbandDoB,onUserInput:this.setFormData,ref:"ProbandDoB",disabled:e,required:a}),React.createElement(DateElement,{label:"Confirm DoB Proband",name:"ProbandDoB2",value:this.state.Data.ProbandDoB,onUserInput:this.setFormData,ref:"ProbandDoB2",disabled:e,required:r}),React.createElement(StaticElement,{label:"Age Difference (months)",text:this.state.Data.ageDifference}),t))},handleSubmit:function(e){e.preventDefault();var t=this.state.formData,a=new Date,r=a.getDate(),n=a.getMonth()+1,s=a.getFullYear();r<10&&(r="0"+r),n<10&&(n="0"+n),a=s+"-"+n+"-"+r;var o=t.ProbandDoB?t.ProbandDoB:null,l=t.ProbandDoB2?t.ProbandDoB2:null;if(o!==l)return void alert("DOB do not match!");if(o>a)return void alert("Consent to study date cannot be later than today!");var d=this,i=new FormData;for(var c in t)""!==t[c]&&i.append(c,t[c]);i.append("tab",this.props.tabName),i.append("candID",this.state.Data.candID),$.ajax({type:"POST",url:d.props.action,data:i,cache:!1,contentType:!1,processData:!1,success:function(e){d.setState({updateResult:"success"}),d.showAlertMessage()},error:function(e){if(""!==e.responseText){var t=JSON.parse(e.responseText).message;d.setState({updateResult:"error",errorMessage:t}),d.showAlertMessage()}}})},showAlertMessage:function(){var e=this;if(null!==this.refs["alert-message"]){var t=this.refs["alert-message"];$(t).fadeTo(2e3,500).delay(3e3).slideUp(500,function(){e.setState({updateResult:null})})}}}),r=React.createFactory(a);window.ProbandInfo=a,window.RProbandInfo=r,t.default=a}]);