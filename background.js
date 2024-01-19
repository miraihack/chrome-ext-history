// alert(window.location.href);

// read local.json for slack web hook URL
// refer http://qiita.com/bonon0/items/47b7a9bc5f2764c55a11

console.log("background.js loaded");

let slack_web_hook, username;

// 修正: local.json ファイルへのアクセス方法を変更
let url = chrome.runtime.getURL('config/local.json');
fetch(url)
    .then((response) => response.json())
    .then((json) => {
        slack_web_hook = json.slack_web_hook;
        username = json.username;
    })
    .catch((error) => {
        console.error('Error reading local.json:', error);
    });


chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse) {
    console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
    if (request.url) {
      postMessage(request.title, request.url, sendResponse);
    }
});

function postMessage(title, url, sendResponse) {
  console.log("postMessage() ", slack_web_hook);
  let postUrl = slack_web_hook;

  let payload = {
    "text": title + "\n" + url,
    "username": username,
    "channel": "test2",
    "icon_emoji": ":ghost:"
  };
  let params = 'payload=' + JSON.stringify(payload);

fetch(postUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(response => {
  if (response.ok) {
    return response.text();  // または response.json() など
  } else {
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    return response.text().then(text => {
      throw new Error(text || 'Network response was not ok.');
    });
  }
})
.then(text => {
  console.log('Response body:', text);
  sendResponse({message: "Saved!"});
})
.catch(error => {
  console.log('Error saving:', error.message);
  sendResponse({message: 'Error saving: ' + error.message});
});
}
