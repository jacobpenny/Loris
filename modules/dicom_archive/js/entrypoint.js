/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _dicom_archive = __webpack_require__(2);

	var _dicom_archive2 = _interopRequireDefault(_dicom_archive);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Render dicom_page on page load
	 */
	window.onload = function () {
	  var dataURL = loris.BaseURL + "/dicom_archive/?format=json";
	  var dicomArchive = _react2.default.createElement(_dicom_archive2.default, {
	    Module: 'dicom_archive',
	    DataURL: dataURL
	  });

	  // Create a wrapper div in which react component will be loaded
	  var dicomArchiveDOM = document.createElement('div');
	  dicomArchiveDOM.id = 'page-dicom-archive';

	  // Append wrapper div to page content
	  var rootDOM = document.getElementById("lorisworkspace");
	  rootDOM.appendChild(dicomArchiveDOM);

	  _react2.default.render(dicomArchive, document.getElementById("page-dicom-archive"));
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _columnFormatter = __webpack_require__(3);

	var _columnFormatter2 = _interopRequireDefault(_columnFormatter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * DICOM Archive Page.
	 *
	 * Serves as an entry-point to the module, rendering the whole react
	 * component page on load.
	 *
	 * Renders DICOM Archive main page consisting of FilterTable and
	 * DataTable components.
	 *
	 * @author Alex Ilea
	 * @version 1.0.0
	 *
	 * */
	var DicomArchive = function (_React$Component) {
	  _inherits(DicomArchive, _React$Component);

	  function DicomArchive(props) {
	    _classCallCheck(this, DicomArchive);

	    var _this = _possibleConstructorReturn(this, (DicomArchive.__proto__ || Object.getPrototypeOf(DicomArchive)).call(this, props));

	    _this.state = {
	      isLoaded: false,
	      Filter: QueryString.get()
	    };

	    // Bind component instance to custom methods
	    _this.fetchData = _this.fetchData.bind(_this);
	    _this.setFilter = _this.setFilter.bind(_this);
	    _this.clearFilter = _this.clearFilter.bind(_this);
	    return _this;
	  }

	  _createClass(DicomArchive, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.fetchData();
	    }

	    /**
	     * Retrive data from the provided URL and save it in state
	     * Additionaly add hiddenHeaders to global loris vairable
	     * for easy access by columnFormatter.
	     */

	  }, {
	    key: 'fetchData',
	    value: function fetchData() {
	      $.ajax(this.props.DataURL, {
	        method: "GET",
	        dataType: 'json',
	        success: function (data) {
	          loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
	          this.setState({
	            Data: data,
	            isLoaded: true
	          });
	        }.bind(this),
	        error: function error(_error) {
	          console.error(_error);
	        }
	      });
	    }

	    /**
	     * Clear the Filter object, querystring and input fields
	     */

	  }, {
	    key: 'clearFilter',
	    value: function clearFilter() {
	      var Filter = QueryString.clear(this.props.Module);
	      this.setState({ Filter: Filter });
	    }

	    /**
	     * Sets Filter object and querystring to reflect values of input fields
	     *
	     * @param {string} fieldName - the name of the form element
	     * @param {string} fieldValue - the value of the form element
	     */

	  }, {
	    key: 'setFilter',
	    value: function setFilter(fieldName, fieldValue) {
	      // Special treatment for site, to explicitly set it as an integer value
	      if (fieldName === "site") {
	        var number = Number.parseInt(fieldValue, 10);
	        if (Number.isInteger(number)) {
	          fieldValue = number;
	        }
	      }

	      var Filter = QueryString.set(this.state.Filter, fieldName, fieldValue);
	      this.setState({ Filter: Filter });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // Waiting for async data to load
	      if (!this.state.isLoaded) {
	        return _react2.default.createElement(
	          'button',
	          { className: 'btn-info has-spinner' },
	          'Loading',
	          _react2.default.createElement('span', {
	            className: 'glyphicon glyphicon-refresh glyphicon-refresh-animate' })
	        );
	      }

	      // Defining element names here ensures that `name` and `ref`
	      // properties of the element are always kept in sync
	      var patientID = "patientID";
	      var patientName = "patientName";
	      var site = "site";
	      var gender = "gender";
	      var dateOfBirth = "dateOfBirth";
	      var acquisition = "acquisition";
	      var archiveLocation = "archiveLocation";
	      var seriesUID = "seriesuid";

	      var genderList = {
	        M: 'Male',
	        F: 'Female',
	        O: 'N/A'
	      };

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          FilterTable,
	          { Module: 'dicom_archive' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(TextboxElement, {
	                name: patientID,
	                label: 'Patient ID',
	                onUserInput: this.setFilter,
	                value: this.state.Filter.patientID,
	                ref: patientID
	              })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(TextboxElement, {
	                name: patientName,
	                label: 'Patient Name',
	                onUserInput: this.setFilter,
	                value: this.state.Filter.patientName,
	                ref: patientName
	              })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(SelectElement, {
	                name: site,
	                label: 'Sites',
	                options: this.state.Data.Sites,
	                onUserInput: this.setFilter,
	                value: this.state.Filter.site,
	                ref: site
	              })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(SelectElement, {
	                name: gender,
	                label: 'Gender',
	                options: genderList,
	                onUserInput: this.setFilter,
	                value: this.state.Filter.gender,
	                ref: gender
	              })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(DateElement, {
	                name: dateOfBirth,
	                label: 'Date of Birth',
	                onUserInput: this.setFilter,
	                value: this.state.Filter.dateOfBirth,
	                ref: dateOfBirth
	              })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(DateElement, {
	                name: acquisition,
	                label: 'Acquisition Date',
	                onUserInput: this.setFilter,
	                value: this.state.Filter.acquisition,
	                ref: acquisition
	              })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(TextboxElement, {
	                name: archiveLocation,
	                label: 'Archive Location',
	                onUserInput: this.setFilter,
	                value: this.state.Filter.archiveLocation,
	                ref: archiveLocation
	              })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(TextboxElement, {
	                name: seriesUID,
	                label: 'Series UID',
	                onUserInput: this.setFilter,
	                value: this.state.Filter.seriesuid,
	                ref: seriesUID
	              })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-md-6' },
	              _react2.default.createElement(ButtonElement, {
	                label: 'Clear Filters',
	                onUserInput: this.clearFilter
	              })
	            )
	          )
	        ),
	        _react2.default.createElement(StaticDataTable, {
	          Data: this.state.Data.Data,
	          Headers: this.state.Data.Headers,
	          Filter: this.state.Filter,
	          getFormattedCell: _columnFormatter2.default
	        })
	      );
	    }
	  }]);

	  return DicomArchive;
	}(_react2.default.Component);

	DicomArchive.propTypes = {
	  Module: _react2.default.PropTypes.string.isRequired,
	  DataURL: _react2.default.PropTypes.string.isRequired
	};

	exports.default = DicomArchive;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Modify behaviour of specified column cells in the Data Table component
	 * @param {string} column - column name
	 * @param {string} cell - cell content
	 * @param {arrray} rowData - array of cell contents for a specific row
	 * @param {arrray} rowHeaders - array of table headers (column names)
	 * @return {*} a formated table cell for a given column
	 */
	function formatColumn(column, cell, rowData, rowHeaders) {
	  // If a column if set as hidden, don't display it
	  if (loris.hiddenHeaders.indexOf(column) > -1) {
	    return null;
	  }

	  // Create the mapping between rowHeaders and rowData in a row object.
	  var row = {};
	  rowHeaders.forEach(function (header, index) {
	    row[header] = rowData[index];
	  }, this);

	  if (column === 'Metadata') {
	    var metadataURL = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + row.TarchiveID;
	    return React.createElement(
	      'td',
	      null,
	      React.createElement(
	        'a',
	        { href: metadataURL },
	        cell
	      )
	    );
	  }

	  if (column === 'MRI Browser') {
	    if (row.SessionID === null || row.SessionID === '') {
	      return React.createElement(
	        'td',
	        null,
	        '\xA0'
	      );
	    }
	    var mrlURL = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID;
	    return React.createElement(
	      'td',
	      null,
	      React.createElement(
	        'a',
	        { href: mrlURL },
	        cell
	      )
	    );
	  }

	  if (cell === "INVALID - HIDDEN") {
	    return React.createElement(
	      'td',
	      { className: 'text-danger' },
	      cell
	    );
	  }

	  return React.createElement(
	    'td',
	    null,
	    cell
	  );
	}

	exports.default = formatColumn;

/***/ }
/******/ ]);