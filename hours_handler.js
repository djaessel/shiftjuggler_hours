
function strip(string) {
  return string.replace(/[0.,]+$/g, '');
}

function showHoursInfo(request, sender, sendResponse) {
  let totalHours = 0.0;
  let tables = document.getElementsByTagName('table');
  let tableRows = document.getElementsByTagName('tbody');

  // extensions.sdk.console.logLevel = all // about:config
  // xpinstall.signatures.required = false // about:config

  let workdays = 0;
  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].children.length > 2) {
      let resultData = tableRows[i].children[2];
      if (resultData.children.length > 5) {
        let finalHoursTxt = resultData.children[5].innerHTML;
        let finalHours = parseFloat(finalHoursTxt.replace(',', '.'));
        totalHours += finalHours;
        workdays += 1;
      }
    }
  }

  let averageHours = totalHours / workdays;

  let message =
    "You have " + strip(totalHours.toFixed(3)) + " hours in total" +
    " | " + workdays.toString() + " days" +
    " | " + strip(averageHours.toFixed(3)) + " hours in average";

  let viewItemCreateButton = document.getElementById('view-item-create-button');
  viewItemCreateButton.style.position = 'relative';
  viewItemCreateButton.setAttribute("class", "col-md-4");

  let hourContainer = document.createElement('div');
  hourContainer.setAttribute("class", "col-md-4");

  let hourInfoElement = document.createElement('h2');
  hourInfoElement.style = "margin-top: 10px;";
  //hourInfoElement.textContent = request.replacement;
  hourInfoElement.textContent = message;
  hourContainer.appendChild(hourInfoElement);

  viewItemCreateButton.parentNode.appendChild(hourContainer);
}

browser.runtime.onMessage.addListener(showHoursInfo);
