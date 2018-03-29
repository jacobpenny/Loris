import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

function onSave(data) {
  const saveURL = window.location.href;
  //TODO FIX THIS CHECK ARMINS SLACK
  $.post(saveURL, {instrumentData: JSON.stringify(data)}).done(function( responseData, textStatus, jqXHR ) {
    //console.log('saved!');
    swal("Saved!", "", "success");
  }).fail(() => {
    //console.log('failed to save!');
    swal("Error!", "Instrument failed to save.", "error");
  });
}

window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const context = JSON.parse(instrumentEl.dataset.context);
  const isFrozen = instrumentEl.dataset.complete;
  const examiners = JSON.parse(instrumentEl.dataset.examiners);
  const agewindows = JSON.parse(instrumentEl.dataset.agewindows);
  const dataEntryMode = true;

  ReactDOM.render(
    <InstrumentFormContainer
      instrument={instrument}
      initialData={initialData}
      lang={lang}
      context={context}
      onSave={onSave}
      options={{}}
      isFrozen={isFrozen}
      examiners={examiners}
      windows={agewindows}
      dataEntryMode={dataEntryMode}
    />,
    document.getElementById("container")
  );
};
