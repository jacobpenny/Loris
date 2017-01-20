!function(e){function t(r){if(a[r])return a[r].exports;var s=a[r]={exports:{},id:r,loaded:!1};return e[r].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),i=function(e){function t(e){a(this,t);var s=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return s.state={Data:{},formData:{},uploadResult:null,isLoaded:!1,loadedData:0},s.handleSubmit=s.handleSubmit.bind(s),s.setFormData=s.setFormData.bind(s),s.showAlertMessage=s.showAlertMessage.bind(s),s}return s(t,e),n(t,[{key:"componentDidMount",value:function(){var e=this;$.ajax(this.props.DataURL,{dataType:"json",success:function(t){var a={idMediaFile:t.mediaData.id,forSite:t.mediaData.forSite,dateTaken:t.mediaData.dateTaken,comments:t.mediaData.comments,hideFile:t.mediaData.hideFile};e.setState({Data:t,isLoaded:!0,mediaData:t.mediaData,formData:a})},error:function(t,a,r){console.error(t,a,r),e.setState({error:"An error occurred when loading the form!"})}})}},{key:"render",value:function(){if(void 0!==this.state.error)return React.createElement("div",{className:"alert alert-danger text-center"},React.createElement("strong",null,this.state.error));if(!this.state.isLoaded)return React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}));var e="",t="alert text-center hide",a=loris.BaseURL.concat("/media/");return this.state.uploadResult&&("success"===this.state.uploadResult?(t="alert alert-success text-center",e="Update Successful!"):"error"===this.state.uploadResult&&(t="alert alert-danger text-center",e="Failed to update the file")),React.createElement("div",null,React.createElement("div",{className:t,role:"alert",ref:"alert-message"},e),"success"===this.state.uploadResult?React.createElement("a",{className:"btn btn-primary",href:a},"Back to media"):null,React.createElement(FormElement,{name:"mediaEdit",onSubmit:this.handleSubmit,ref:"form"},React.createElement("h3",null,"Edit Media File"),React.createElement("br",null),React.createElement(SelectElement,{name:"pscid",label:"PSCID",options:this.state.Data.candidates,onUserInput:this.setFormData,ref:"pscid",required:!0,disabled:!0,value:this.state.mediaData.pscid}),React.createElement(SelectElement,{name:"visitLabel",label:"Visit Label",options:this.state.Data.visits,onUserInput:this.setFormData,ref:"visitLabel",required:!0,disabled:!0,value:this.state.mediaData.visitLabel}),React.createElement(SelectElement,{name:"forSite",label:"Site",options:this.state.Data.sites,onUserInput:this.setFormData,ref:"forSite",disabled:!0,value:this.state.mediaData.forSite}),React.createElement(SelectElement,{name:"instrument",label:"Instrument",options:this.state.Data.instruments,onUserInput:this.setFormData,ref:"instrument",disabled:!0,value:this.state.mediaData.instrument}),React.createElement(DateElement,{name:"dateTaken",label:"Date of Administration",minYear:"2000",maxYear:"2017",onUserInput:this.setFormData,ref:"dateTaken",value:this.state.formData.dateTaken}),React.createElement(TextareaElement,{name:"comments",label:"Comments",onUserInput:this.setFormData,ref:"comments",value:this.state.formData.comments}),React.createElement(FileElement,{name:"file",id:"mediaEditEl",onUserInput:this.setFormData,required:!0,disabled:!0,ref:"file",label:"Uploaded file",value:this.state.formData.fileName}),React.createElement(SelectElement,{name:"hideFile",label:"Hide File",emptyOption:!1,options:["No","Yes"],onUserInput:this.setFormData,ref:"hideFile",value:this.state.formData.hideFile}),React.createElement(ButtonElement,{label:"Update File"})))}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this,a=this.state.formData;$("#mediaEditEl").hide(),$("#file-progress").removeClass("hide"),$.ajax({type:"POST",url:t.props.action,data:JSON.stringify(a),cache:!1,contentType:!1,processData:!1,xhr:function e(){var e=new window.XMLHttpRequest;return e.upload.addEventListener("progress",function(e){if(e.lengthComputable){var t=$("#progressbar"),a=$("#progresslabel"),r=Math.round(e.loaded/e.total*100);$(t).width(r+"%"),$(a).html(r+"%"),t.attr("aria-valuenow",r)}},!1),e},success:function(e){$("#file-progress").addClass("hide"),t.setState({uploadResult:"success"}),t.showAlertMessage()},error:function(e){console.error(e),t.setState({uploadResult:"error"}),t.showAlertMessage()}})}},{key:"setFormData",value:function(e,t){var a=this.state.formData;""===t?a[e]=null:a[e]=t,this.setState({formData:a})}},{key:"showAlertMessage",value:function(){var e=this;if(null!==this.refs["alert-message"]){var t=this.refs["alert-message"];$(t).fadeTo(2e3,500).delay(3e3).slideUp(500,function(){e.setState({uploadResult:null})})}}}]),t}(React.Component);i.propTypes={DataURL:React.PropTypes.string.isRequired,action:React.PropTypes.string.isRequired};var o=React.createFactory(i);window.MediaEditForm=i,window.RMediaEditForm=o,t.default=i}]);