import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

function onSave() {
  console.log('save not implemented!');
}

window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const context = JSON.parse(instrumentEl.dataset.context);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const logo = instrumentEl.dataset.logo ? instrumentEl.dataset.logo : "";
  const options = { surveyMode: true };
  const curDate = new Date();
  const curDateSt = (curDate.getMonth()+1) + "/" + curDate.getDate() + "/" + curDate.getFullYear();
  ReactDOM.render(
    <div>
      <img id="banner" className="banner"/>
      <img id="logo" src={logo}/>
      <div><font color="white">Date: {curDateSt}</font></div>
      <InstrumentFormContainer
        instrument={instrument}
        initialData={initialData}
        lang={lang}
        context={context}
        options={options}
        onSave={onSave}
      />
    </div>,
    document.getElementById("container")
  );
};
