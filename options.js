function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    hoursPerDay: parseFloat(document.querySelector("#hoursPerDay").value),
    hoursPerMonth: parseFloat(document.querySelector("#hoursPerMonth").value),
    moneyPerMonth: parseFloat(document.querySelector("#moneyPerMonth").value),
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#hoursPerDay").value = parseFloat(result.hoursPerDay) || 0; // h
    document.querySelector("#hoursPerMonth").value = parseFloat(result.hoursPerMonth) || 0; // h
    document.querySelector("#moneyPerMonth").value = parseFloat(result.moneyPerHour) || 0; // €
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let hoursPerDay = browser.storage.sync.get("hoursPerDay");
  hoursPerDay.then(setCurrentChoice, onError);

  let hoursPerMonth = browser.storage.sync.get("hoursPerMonth");
  hoursPerMonth.then(setCurrentChoice, onError);

  let moneyPerMonth = browser.storage.sync.get("moneyPerMonth");
  moneyPerMonth.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
