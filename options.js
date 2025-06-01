function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    hoursPerDay: parseFloat(document.querySelector("#hoursPerDay").value),
    moneyPerMonth: parseFloat(document.querySelector("#moneyPerMonth").value),
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#hoursPerDay").value = parseFloat(result.hoursPerDay) || 4.0; // h
    document.querySelector("#moneyPerMonth").value = parseFloat(result.moneyPerHour) || 1600; // €
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let hoursPerDay = browser.storage.sync.get("hoursPerDay");
  hoursPerDay.then(setCurrentChoice, onError);

  let moneyPerMonth = browser.storage.sync.get("moneyPerMonth");
  moneyPerMonth.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
