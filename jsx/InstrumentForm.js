import Form from './Form';

const { SelectElement, RadioGroupLabels, RadioGroupElement, CheckboxGroupElement, TextboxElement, DateElement } = Form;

/* InstrumentForm and InstrumentFormContainer follow the `presentational vs container`
 * pattern (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). 
 * The meta and elements passed to this component must already be 'localized' 
 * (see ./lib/localize-instrument).
 */
const InstrumentForm = ({meta, elements, showRequired, errorMessage, onUpdate, onSave, saveText, saveWarning, isFrozen, dataEntryMode, metaData, examiners}) => {
  return (
    <div>
      <div id="instrument-error">
        { errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null }
      </div>
      {renderTitle(meta)}
      <div>{renderMeta(dataEntryMode, metaData, isFrozen ? true : false, onUpdate, examiners)}</div>
      {
        elements.map((element, index) => (
          renderElement(element, index, onUpdate, showRequired, element.Options.RequireResponse, isFrozen ? true : false )
        ))
      }
      {renderSave(isFrozen ? true : false, onSave, saveText, saveWarning)}
    </div>
  );
};

function renderSave(disabled = false, onSave, saveText, saveWarning) {
  if (!disabled) {
    return (
      <SaveButton onClick={onSave} saveText={saveText} saveWarning={saveWarning}/>
    )
  }
}

function renderTitle(meta) {
  return (
    <div className="title">
      <h1>{meta.LongName}</h1>
    </div>
  )
}

function renderMeta(dataEntryMode, metaData, isDisabled, onUpdate, examiners) {
  if (dataEntryMode) {
    const key = -1;
    return (
      <div className="meta" key={key}>
        <div className="col-xs-12">
          <DateElement
            name={"Date_taken"}
            label={"<b>Date of Administration</b>"}
            value={metaData[0]}
            disabled={isDisabled}
            onUserInput={onUpdate}
          />
        </div>
        <div className="col-xs-12">
          <TextboxElement
            name={"Candidate_Age"}
            label={"<b>Candidate Age (Months)</b>"}
            value={metaData[1] ? metaData[1].toString() : ""}
            onUserInput={onUpdate}
            disabled={true}
          />
        </div>
        <div className="col-xs-12" hidden={true}>
          <TextboxElement
            name={"Window_Difference"}
            label={"<b>Window Difference (+/- Days)</b>"}
            value={metaData[2]===0 ? metaData[2].toString(): metaData[2] ? metaData[2].toString() : ""}
            disabled={true}
            onUserInput={onUpdate}
          />
        </div>
        <div className="col-xs-12">
          <SelectElement
            name={"Examiner"}
            label={"<b>Examiner</b>"}
            value={metaData[3]}
            selected={metaData[3]}
            disabled={isDisabled}
            options={examiners}
            onUserInput={onUpdate}
          />
        </div>
      </div>
    )
  }
}

function renderElement(element, key, onUpdate, showRequired = false,required = false, disabled = false) {
  if (element.Type === 'label') {
    return renderLabel(element, key)
  } else if (element.Type === 'radio-labels') {
    return renderRadioLabels(element, key)
  } else if (element.Type === 'radio') {
    return <div className="hoverRow">
             {renderRadio(element, key, onUpdate, showRequired, required, disabled)}
           </div>
  } else if (element.Type === 'select') {
    return <div className="hoverRow">
             {renderSelect(element, key, onUpdate, showRequired, required, disabled)}
           </div>
  } else if (element.Type === 'checkbox') {
    return <div className="hoverRow">
             {renderCheckbox(element, key, onUpdate, showRequired, required, disabled)}
           </div>
  } else if (element.Type === 'text') {
    if (element.Options['Type'] === 'large') {
        return <div className="hoverRow">
                 {renderTextArea(element, key, onUpdate, showRequired, required, disabled)}
               </div>
    } else {
        return <div className="hoverRow">
                 {renderText(element, key, onUpdate, showRequired, required, disabled)}
               </div>
    }
  } else if (element.Type === 'calc') {
    return renderCalc(element, key, onUpdate)
  } else if (element.Type === 'date') {
    return <div className="hoverRow">
             {renderDate(element, key, onUpdate, showRequired, required, disabled)}
           </div>
  }
}

function renderLabel(element, key) {
  // Form's StaticElement doesn't allow us to set HTML.
  return (<div className="instrument-label" key={key} dangerouslySetInnerHTML={{__html: element.Description}} />);
}

function renderRadioLabels(element, key) {
  return (
    <RadioGroupLabels key={key} labels={element.Labels}/>
  );
}

function renderRadio(element, key, onUpdate, showRequired, isRequired, isDisabled) {
  return (
      <div className="row form-group" key={key}>
        <RadioGroupElement
          name={element.Name}
          label={element.Description}
          options={element.Options.Values}
          orientation={element.Options.Orientation}
          onUserInput={onUpdate}
          value={element.Value}
          order={element.Options.Order}
          hasError={showRequired && isRequired && (!element.Value)}
          disabled={isDisabled}
          elementClassOverride={true}
          showRequired={showRequired}
          required={isRequired}
        />
        {renderReset(isDisabled, onUpdate, element)}
      </div>
  );
}

function renderReset(disabled = false, onUpdate, element) {
  if (!disabled) {
    return (
      <button className="asText" onClick={() => { onUpdate(element.Name, null); }
                                         } type="button">
        Reset
      </button>
    )
  }
}

function renderSelect(element, key, onUpdate, showRequired, isRequired, isDisabled) {
  if (element.Options.AllowMultiple) {
    <p>MultiSelects not implemented yet</p>
  } else {
    return (
      <SelectElement
        key={key}
        name={element.Name}
        label={element.Description}
        options={element.Options.Values}
        onUserInput={onUpdate}
        value={element.Value}
        disabled={isDisabled}
        showRequired={showRequired}
        required={isRequired}
      />
    );
  }
}

function renderCheckbox(element, key, onUpdate, showRequired, isRequired, isDisabled) {
  return (
    <CheckboxGroupElement
      key={key}
      name={element.Name}
      label={element.Description}
      options={element.Options.Values}
      onUserInput={onUpdate}
      value={element.Value}
      disabled={isDisabled}
      showRequired={showRequired}
      required={isRequired}
    />
  );
}

function renderText(element, key, onUpdate, showRequired, isRequired, isDisabled) {
  return (
    <TextboxElement
      key={key}
      name={element.Name}
      label={element.Description}
      onUserInput={onUpdate}
      value={element.Value}
      disabled={isDisabled}
      showRequired={showRequired}
      required={isRequired}
    />
  );
}

function renderTextArea(element, key, onUpdate, showRequired, isRequired, isDisabled) {
  return (
    <TextareaElement
      key={key}
      name={element.Name}
      label={element.Description}
      onUserInput={onUpdate}
      value={element.Value}
      disabled={isDisabled}
      showRequired={showRequired}
      required={isRequired}
    />
  );
}

function renderCalc(element, key, onUpdate) {
  return (
    <TextboxElement
      key={key}
      name={element.Name}
      label={element.Description}
      value={element.Value}
      disabled={true}
    />
  );
}

function renderDate(element, key, onUpdate, showRequired, isRequired, isDisabled) {
  return (
    <DateElement
      key={key}
      name={element.Name}
      label={element.Description}
      onUserInput={onUpdate}
      value={element.Value}
      disabled={isDisabled}
      showRequired={showRequired}
      required={isRequired}
    />
  )
}

const SaveButton = ({onClick, saveText, saveWarning}) => {
  return (
    <div>
      <button onClick={onClick} id="save" type="button" className="btn btn-default btn-lg">
        <span className="" aria-hidden="true"></span> {saveText}
      </button>
      <center><p id="warning">{saveWarning}</p></center>
    </div>
  );
}

export default InstrumentForm;
