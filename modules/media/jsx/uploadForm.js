/* global FormValidation */
/* exported RMediaUploadForm */

/**
 * Media Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a media file attached to a specific instrument
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
class MediaUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      validationErrors: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.customFileNameRule = this.customFileNameRule.bind(this);

    this.fieldValidations = {
      pscid: FormValidation.createValidator('pscid', 'PSCID', FormValidation.rules.required),
      visitLabel: FormValidation.createValidator('visitLabel', 'Visit Label', FormValidation.rules.required),
      forSite: FormValidation.createValidator('forSite', 'Site', FormValidation.rules.required),
      file: FormValidation.createValidator('file', 'File', this.customFileNameRule)
    };

  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className="alert alert-danger text-center">
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    var helpText = [
      "File name should begin with ",
      <b>[PSCID]_[Visit Label]_[Instrument]</b>,
      <br/>,
      " For example, for candidate ",
      <i>ABC123</i>,
      ", visit ",
      <i>V1</i>,
      " for ",
      <i>Body Mass Index</i>,
      " the file name should be prefixed by: ",
      <b>ABC123_V1_Body_Mass_Index</b>
    ];
    var alertMessage = "";
    var alertClass = "alert text-center hide";

    if (this.state.uploadResult) {
      if (this.state.uploadResult === "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Upload Successful!";
      } else if (this.state.uploadResult === "error") {
        var errorMessage = this.state.errorMessage;
        alertClass = "alert alert-danger text-center";
        alertMessage = errorMessage ? errorMessage : "Failed to upload!";
      }
    }

    return (
      <div>
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        <FormElement
          name="mediaUpload"
          fileUpload={true}
          onSubmit={this.handleSubmit}
          ref="form"
        >
          <h3>Upload a media file</h3>
          <br />
          <StaticElement
            label="Note"
            text={helpText}
          />
          <SelectElement
            name="pscid"
            label="PSCID"
            options={this.state.Data.candidates}
            onUserInput={this.setFormData}
            value={this.state.formData.pscid}
            errorMessage={this.state.validationErrors.pscid}
            required={true}
          />
          <SelectElement
            name="visitLabel"
            label="Visit Label"
            options={this.state.Data.visits}
            onUserInput={this.setFormData}
            value={this.state.formData.visitLabel}
            errorMessage={this.state.validationErrors.visitLabel}
            required={true}
          />
          <SelectElement
            name="forSite"
            label="Site"
            options={this.state.Data.sites}
            onUserInput={this.setFormData}
            value={this.state.formData.forSite}
            errorMessage={this.state.validationErrors.forSite}
            required={true}
          />
          <SelectElement
            name="instrument"
            label="Instrument"
            options={this.state.Data.instruments}
            onUserInput={this.setFormData}
            value={this.state.formData.instrument}
          />
          <DateElement
            name="dateTaken"
            label="Date of Administration"
            minYear="2000"
            maxYear="2017"
            onUserInput={this.setFormData}
            value={this.state.formData.dateTaken}
          />
          <TextareaElement
            name="comments"
            label="Comments"
            onUserInput={this.setFormData}
            value={this.state.formData.comments}
          />
          <FileElement
            name="file"
            id="mediaUploadEl"
            onUserInput={this.setFormData}
            value={this.state.formData.file ? this.state.formData.file.name : null}
            errorMessage={this.state.validationErrors.file}
            label="File to upload"
            required={true}
          />
          
          <ButtonElement label="Upload File" />
        </FormElement>
      </div>
    );
  }

 /** *******************************************************************************
 *                      ******     Helper methods     *******
 *********************************************************************************/

  /**
   * Returns a valid name for the file to be uploaded
   *
   * @param {string} pscid - PSCID selected from the dropdown
   * @param {string} visitLabel - Visit label selected from the dropdown
   * @param {string} instrument - Instrument selected from the dropdown
   * @return {string} - Generated valid filename for the current selection
   */
  getValidFileName(pscid, visitLabel, instrument) {
    var fileName = pscid + "_" + visitLabel;
    if (instrument) fileName += "_" + instrument;

    return fileName;
  }

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    var myFormData = this.state.formData;
    var formRefs = this.refs;

    // Validate the form
    if (!this.isValidForm(myFormData)) {
      return;
    }

    // Set form data and upload the media file
    var self = this;
    var formData = new FormData();
    for (var key in myFormData) {
      if (myFormData[key] !== "") {
        formData.append(key, myFormData[key]);
      }
    }

    $('#mediaUploadEl').hide();
    $("#file-progress").removeClass('hide');

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar");
            var progresslabel = $("#progresslabel");
            var percent = Math.round((evt.loaded / evt.total) * 100);
            $(progressbar).width(percent + "%");
            $(progresslabel).html(percent + "%");
            progressbar.attr('aria-valuenow', percent);
          }
        }, false);
        return xhr;
      },
      success: function(data) {
        $("#file-progress").addClass('hide');
        self.setState({
          uploadResult: "success",
          formData: {} // reset form data after successful file upload
        });

        // Trigger an update event to update all observers (i.e DataTable)
        var event = new CustomEvent('update-datatable');
        window.dispatchEvent(event);

        self.showAlertMessage();

        // Iterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function(ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
        // rerender components
        self.forceUpdate();
      },
      error: function(err) {
        var errorMessage = JSON.parse(err.responseText).message;
        self.setState({
          uploadResult: "error",
          errorMessage: errorMessage
        });
        self.showAlertMessage();
      }

    });
  }

  /**
   * Checks if the inputted file name is valid
   *
   * @param {string} requiredFileName - Required file name
   * @param {string} fileName - Provided file name
   * @return {boolean} - true if fileName starts with requiredFileName, false otherwise
   */
  isValidFileName(requiredFileName, fileName) {
    if (!fileName || !requiredFileName) {
      return false;
    }

    return (fileName.indexOf(requiredFileName) === 0);
  }

  /**
   * Validate the form
   *
   * @param {object} formData - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm(formData) {
    const validationErrors = FormValidation.generateValidationErrors(formData, this.fieldValidations);
    this.setState({validationErrors});
    const hasValidationErrors = Object.values(validationErrors).reduce((a,b) => a || b);
    return !hasValidationErrors;
  }

  /**
   * Updates formData and validationErrors state when a form value changes
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    // Only display visits and sites available for the current pscid
    if (formElement === "pscid" && value !== "") {
      this.state.Data.visits = this.state.Data.sessionData[value].visits;
      this.state.Data.sites = this.state.Data.sessionData[value].sites;
    }

    var formData = this.state.formData;
    formData[formElement] = value;

    const validationError = FormValidation.validateField(formData, formElement, this.fieldValidations);

    this.setState({
      formData: formData,
      validationErrors: Object.assign(this.state.validationErrors, validationError)
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    var self = this;

    if (this.refs["alert-message"] === null) {
      return;
    }

    var alertMsg = this.refs["alert-message"].getDOMNode();
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function() {
      self.setState({
        uploadResult: null
      });
    });
  }

  customFileNameRule(formData, file) {
    if (!file) {
      return (fieldName) => `${fieldName} is required`
    }

    if (!formData.pscid || !formData.visitLabel) {
      return null;
    }

    const requiredFileName = this.getValidFileName(
      formData.pscid, formData.visitLabel, formData.instrument
    );

    if (!this.isValidFileName(requiredFileName, file.name)) {
      return (fieldName) => `${fieldName} should begin with: ${requiredFileName}`;
    } else {
      return null;
    }
  }
}


MediaUploadForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired
}

var RMediaUploadForm = React.createFactory(MediaUploadForm);
