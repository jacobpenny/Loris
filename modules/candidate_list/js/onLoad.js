!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}({0:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _AccessProfilePanel=__webpack_require__(24),_AccessProfilePanel2=_interopRequireDefault(_AccessProfilePanel);$(function(){ReactDOM.render(React.createElement(_AccessProfilePanel2.default,null),document.getElementById("openprofile")),ReactDOM.render(React.createElement(DynamicDataTable,{DataURL:loris.BaseURL+"/candidate_list/?format=json",getFormattedCell:formatColumn,freezeColumn:"PSCID"}),document.getElementById("datatable"))})},24:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_Panel=__webpack_require__(25),_Panel2=_interopRequireDefault(_Panel),AccessProfilePanel=function(_React$Component){function AccessProfilePanel(props){_classCallCheck(this,AccessProfilePanel);var _this=_possibleConstructorReturn(this,(AccessProfilePanel.__proto__||Object.getPrototypeOf(AccessProfilePanel)).call(this,props));return _this.state={error:{message:"",className:"alert alert-danger text-center"},PSCID:"",CandID:""},_this.updateFormElement=_this.updateFormElement.bind(_this),_this.validateAndSubmit=_this.validateAndSubmit.bind(_this),_this}return _inherits(AccessProfilePanel,_React$Component),_createClass(AccessProfilePanel,[{key:"updateFormElement",value:function(formElement,value){var state=this.state;state[formElement]=value,this.setState(state)}},{key:"validateAndSubmit",value:function(){var state=this.state;return""===this.state.CandID?(state.error={message:"You must enter a DCCID!",className:"alert alert-danger text-center"},void this.setState(state)):""===this.state.PSCID?(state.error={message:"You must enter a PSCID!",className:"alert alert-danger text-center"},void this.setState(state)):(state.error={message:"Validating...",className:"alert alert-info text-center"},this.setState(state),void $.get(loris.BaseURL+"/candidate_list/ajax/validateProfileIDs.php",{CandID:state.CandID,PSCID:state.PSCID},function(data){"1"===data?(state.error={message:"Opening profile...",className:"alert alert-info text-center"},window.location.href=loris.BaseURL+"/"+state.CandID):state.error={message:"DCCID or PSCID is not valid",className:"alert alert-danger text-center"},this.setState(state)}.bind(this)))}},{key:"render",value:function(){var warning;return loris.userHasPermission("access_all_profiles")?React.createElement("div",null):(""!==this.state.error.message&&(warning=React.createElement("div",{className:this.state.error.className},this.state.error.message)),React.createElement("div",{className:"col-sm-3"},React.createElement(_Panel2.default,{title:"Open Profile"},React.createElement(FormElement,{name:"openprofile",onSubmit:this.validateAndSubmit,onUserInput:this.validateAndSubmit},React.createElement(TextboxElement,{name:"CandID",label:"CandID",value:this.state.CandID,onUserInput:this.updateFormElement}),React.createElement(TextboxElement,{name:"PSCID",label:"PSCID",value:this.state.PSCID,onUserInput:this.updateFormElement}),warning,React.createElement(ButtonElement,{name:"Open Profile",label:"Open Profile",onUserInput:this.validateAndSubmit})))))}}]),AccessProfilePanel}(React.Component);exports.default=AccessProfilePanel},25:function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Panel=function(_React$Component){function Panel(props){_classCallCheck(this,Panel);var _this=_possibleConstructorReturn(this,(Panel.__proto__||Object.getPrototypeOf(Panel)).call(this,props));return _this.state={collapsed:_this.props.initCollapsed},_this.panelClass=_this.props.initCollapsed?"panel-collapse collapse":"panel-collapse collapse in",_this.toggleCollapsed=_this.toggleCollapsed.bind(_this),_this}return _inherits(Panel,_React$Component),_createClass(Panel,[{key:"toggleCollapsed",value:function(){this.setState({collapsed:!this.state.collapsed})}},{key:"render",value:function(){var glyphClass=this.state.collapsed?"glyphicon pull-right glyphicon-chevron-down":"glyphicon pull-right glyphicon-chevron-up",panelHeading=this.props.title?React.createElement("div",{className:"panel-heading",onClick:this.toggleCollapsed,"data-toggle":"collapse","data-target":"#"+this.props.id,style:{cursor:"pointer"}},this.props.title,React.createElement("span",{className:glyphClass})):"";return React.createElement("div",{className:"panel panel-primary"},panelHeading,React.createElement("div",{id:this.props.id,className:this.panelClass,role:"tabpanel"},React.createElement("div",{className:"panel-body",style:{height:this.props.height}},this.props.children)))}}]),Panel}(React.Component);Panel.propTypes={id:React.PropTypes.string,height:React.PropTypes.string,title:React.PropTypes.string},Panel.defaultProps={initCollapsed:!1,id:"default-panel",height:"100%"},exports.default=Panel}});
//# sourceMappingURL=onLoad.js.map