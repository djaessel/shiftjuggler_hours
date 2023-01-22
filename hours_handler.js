
function showHoursInfo(request, sender, sendResponse) {
  let viewItemCreateButton = document.getElementById('view-item-create-button');
  viewItemCreateButton.style.position = 'relative';
  viewItemCreateButton.setAttribute("class", "col-md-4");

  let hourContainer = document.createElement('div');
  hourContainer.setAttribute("class", "col-md-4");

  let hourInfoElement = document.createElement('h2');
  hourInfoElement.style = "margin-top: 10px;";
  hourInfoElement.textContent = request.replacement;
  hourContainer.appendChild(hourInfoElement);

  viewItemCreateButton.parentNode.appendChild(hourContainer);
}

browser.runtime.onMessage.addListener(showHoursInfo);
