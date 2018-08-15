function fixhtml(html) {
  var div = document.createElement('div');
  div.innerHTML=html;
  return (div.innerHTML);
}

function localizeInstrument(rawInstrument, lang = 'en-ca') {
  const instrument = JSON.parse(JSON.stringify(rawInstrument));
  
  if (instrument['Meta']['Multilingual']=='false') {
    lang=instrument['Meta']['DefaultLanguage'];
  }

  try {
    instrument['Meta']['LongName'] = instrument['Meta']['LongName'][lang];

    const convertedElements = [];

    instrument['Elements'].forEach((element) => {
      if (['label', 'text', 'calc', 'date', 'select', 'radio', 'checkbox', 'numeric'].includes(element.Type)) {
        if (element['Description'][lang] && element['Description'][lang] !== " " && element['Comment']) {
          element['Description'] = fixhtml(element['Description'][lang]) + "; " + fixhtml(element['Comment']);
        } else if (element['Description'][lang] && element['Description'][lang] !== " " && !element['Comment']) {
          element['Description'] = element['Description'][lang];
        } else {
          if (['text', 'date', 'numeric'].includes(element.Type)) {
            element['Description'] = element.Comment ? element.Comment : "";
          } else if (['select', 'radio', 'checkbox'].includes(element.Type)) {
            element['Description'] = "";
          } else if (['label'].includes(element.Type)) {
            element['Description'] = "";
          } else if (['calc'].includes(element.Type)) {
            element['Description'] = element.Comment ? element.Comment : "";
          }
        }
        if (['select', 'radio', 'checkbox'].includes(element.Type)) {
          element['Options']['Values'] = element['Options']['Values'][lang];
        }
        convertedElements.push(element);
      } else if (['radio-labels'].includes(element.Type) && element['Labels'][lang]) {
        element['Labels'] = element['Labels'][lang];
        convertedElements.push(element);
      }
    });

    instrument['Elements'] = convertedElements;
    return instrument;
  } catch (e) {
    console.log(e);
  }
}

export default localizeInstrument;
