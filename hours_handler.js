
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
    if (tableRows[i].children.length >= 2) {
      let resultData = tableRows[i].children[1];
      if (resultData.children.length > 5) {
        let finalHoursTxt = resultData.children[5].innerHTML;
        let finalHours = parseFloat(finalHoursTxt.replace(',', '.'));
        totalHours += finalHours;
        workdays += 1;
      }
    } else if (tableRows[i].children.length == 1) {
      let resultData = tableRows[i].children[0];
      if (resultData.children.length > 5) {
        let infoText = resultData.children[8].innerHTML;
        if (infoText.includes("gemeldet")) {
          for (var xyy = 0; xyy < resultData.children.length; xyy++) {
            console.log(resultData.children[xyy].innerHTML)
          }
          let finalHoursTxt = resultData.children[7].innerHTML;
          finalHoursTxt = finalHoursTxt.replace('<span>', '')
          finalHoursTxt = finalHoursTxt.replace('</span>', '')
          let finalHours = parseFloat(finalHoursTxt.replace(',', '.'));
          console.log("FINAL_HOURS:")
          console.log(finalHours)
          totalHours += finalHours;
          workdays += 1;
        }
      }
    }
  }

  let averageHours = totalHours / workdays;
  let expectedHours = workdays * 4;

  let message =
    "You have " + strip(totalHours.toFixed(3)) + " hours in total" +
    " | Expected " + expectedHours.toString() + " hours" +
    " | " + workdays.toString() + " days" +
    " | " + strip(averageHours.toFixed(3)) + " hours in average";

  let viewItemCreateButton = document.getElementById('view-item-create-button');
  viewItemCreateButton.style.position = 'relative';
  viewItemCreateButton.setAttribute("class", "col-md-4");

  let hourE = document.getElementById('shiftjuggler-hours-id');
  if (!hourE) {
    let hourContainer = document.createElement('div');
    hourContainer.setAttribute("class", "col-md-8");

    let hourInfoElement = document.createElement('h2');
    hourInfoElement.setAttribute("id", "shiftjuggler-hours-id");
    hourInfoElement.style = "margin-top: 10px;";
    //hourInfoElement.textContent = request.replacement;
    hourInfoElement.textContent = message;
    hourContainer.appendChild(hourInfoElement);

    viewItemCreateButton.parentNode.appendChild(hourContainer);
  } else {
    hourE.textContent = message;
  }
}

browser.runtime.onMessage.addListener(showHoursInfo);
