/* global MediaEditForm */
const args = QueryString.get(document.currentScript.src);

$(function() {
  var mediaEditForm = <MediaEditForm
    DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData&idMediaFile=${args.idMediaFile}`}
    action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=edit`}
  />;

  React.render(mediaEditForm, document.getElementById("media-edit-form"));
});
