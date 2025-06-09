
function rtrimChar(string, charToRemove) {
  while(string.charAt(string.length-1)==charToRemove) {
      string = string.substring(0,string.length-1);
  }

  return string;
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  let xy = JSON.parse(JSON.stringify(item));
  if ("hoursPerDay" in xy) {
    var workingHours = xy["hoursPerDay"];
    let vv = document.getElementById('view-item-create-button')
    vv.setAttribute("data-hours", workingHours);
  } else if ("hoursPerMonth" in xy) {
    var workingHours = xy["hoursPerMonth"];
    let vv = document.getElementById('view-item-create-button')
    vv.setAttribute("data-monthhours", workingHours);
  } else if ("moneyPerMonth" in xy) {
    var moneyPerMonth = xy["moneyPerMonth"];
    let vv = document.getElementById('view-item-create-button')
    vv.setAttribute("data-money", moneyPerMonth);
  }
}

const hoursPerDayx = browser.storage.sync.get("hoursPerDay");
hoursPerDayx.then(onGot, onError);

const hoursPerMonthx = browser.storage.sync.get("hoursPerMonth");
hoursPerMonthx.then(onGot, onError);

const moneyPerMonth = browser.storage.sync.get("moneyPerMonth");
moneyPerMonth.then(onGot, onError);


function createMessageText(totalHours, expectedHours, workdays, averageHours, totalMoney) {
  let message =
    "You have " + rtrimChar(rtrimChar(totalHours.toFixed(3), "0"), ".") + " hours in total" +
    " | Expected " + expectedHours.toString() + " hours" +
    " | " + workdays.toString() + " days" +
    " | " + rtrimChar(rtrimChar(averageHours.toFixed(3), "0"), ".") + " hours in average" +
    " | " + rtrimChar(rtrimChar(totalMoney.toFixed(2), "0"), ".") + " € per Month"
  ;
  return message;
}

const getDaysInMonth = (month, year) => (new Array(31)).fill('').map((v,i)=>new Date(year,month-1,i+1)).filter(v=>v.getMonth()===month-1)


function showHoursInfo(request, sender, sendResponse) {
  let workdays = 0;
  let totalHours = 0.0;
  let tableRows = document.getElementsByTagName('tbody');

  // extensions.sdk.console.logLevel = all // about:config
  // xpinstall.signatures.required = false // about:config

  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].children.length >= 2) {
      let resultData = tableRows[i].children[1];
      if (resultData.children.length > 5) {
        let finalHoursTxt = resultData.children[5].innerHTML;
        let finalHours = parseFloat(finalHoursTxt.replace(',', '.'));
        totalHours += finalHours;

        // Old workdays logic deactivated
        //let mySubmittedData = tableRows[i].children[0];
        //let dayInfoText = mySubmittedData.children[0].innerHTML;
        //if (!(dayInfoText.includes(" - Sa") || dayInfoText.includes(" - So"))) {
        //  workdays += 1;
        //}
      }
    } else if (tableRows[i].children.length == 1) {
      let resultData = tableRows[i].children[0];
      if (resultData.children.length > 5) {
        let infoText = resultData.children[8].innerHTML;
        if (infoText.includes("gemeldet")) {
          let finalHoursTxt = resultData.children[7].innerHTML;
          finalHoursTxt = finalHoursTxt.replace('<span>', '')
          finalHoursTxt = finalHoursTxt.replace('</span>', '')
          let finalHours = parseFloat(finalHoursTxt.replace(',', '.'));
          totalHours += finalHours;

          // Old workdays logic deactivated
          //let dayInfoText = resultData.children[0].innerHTML;
          //if (!(dayInfoText.includes(" - Sa") || dayInfoText.includes(" - So"))) {
          //  workdays += 1;
          //}
        }
      }
    }
  }

  // TODO: add check for time and multiple entries per day!

  let dataElementX = document.getElementById('view-item-create-button');
  let hoursPerDay = parseFloat(dataElementX.getAttribute("data-hours"));
  let hoursPerMonth = parseFloat(dataElementX.getAttribute("data-monthhours"));
  let moneyPerMonth = parseFloat(dataElementX.getAttribute("data-money"));

  // TODO: check for holidays
  // https://feiertage-api.de/api/
  /*try {
    //let jsonDateData = httpGet("https://feiertage-api.de/api/");
    let jsonDateData = readHolidaysFile()
    let holidays = JSON.parse(jsonDateData);
    console.log(holidays);
  } catch (e) {
    console.log(e);
  }*/

  let nowDateTime = new Date();
  let daysOfMonth = getDaysInMonth(nowDateTime.getMonth(), nowDateTime.getFullYear());
  var options = { weekday: 'short' };
  daysOfMonth.forEach(element => {
    let dateShort = element.toLocaleDateString("de-DE", options);
    if (dateShort[0] != 'S') {
      workdays += 1;
    }
  });

  let averageHours = totalHours / workdays;
  let expectedHours = 0.0;
  if (hoursPerMonth > 0) {
    expectedHours = hoursPerMonth / workdays;
  } else {
    expectedHours = workdays * hoursPerDay;
  }
  let totalMoney = moneyPerMonth / expectedHours * totalHours;

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
    hourInfoElement.textContent = createMessageText(totalHours, expectedHours, workdays, averageHours, totalMoney);
    hourContainer.appendChild(hourInfoElement);

    viewItemCreateButton.parentNode.appendChild(hourContainer);
  } else {
    hourE.textContent = createMessageText(totalHours, expectedHours, workdays, averageHours, totalMoney);
  }
}

browser.runtime.onMessage.addListener(showHoursInfo);
