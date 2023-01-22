browser.contextMenus.create({
  id: "shiftjuggler-hours",
  title: "Show total hours"
});

function messageTab(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {
    replacement: "55 hours total!"
  });
}

function onExecuted(result) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "shiftjuggler-hours") {
    let executing = browser.tabs.executeScript({
      file: "hours_handler.js"
    });
    executing.then(onExecuted);
  }
});
