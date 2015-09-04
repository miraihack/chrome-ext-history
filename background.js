// alert(window.location.href);

// read local.json for slack web hook URL
// refer http://qiita.com/bonon0/items/47b7a9bc5f2764c55a11

console.log("background.js loaded");

var slack_web_hook, username;

chrome.runtime.getPackageDirectoryEntry(function(root) {
  root.getFile ('local.json', {create: false }, function( sample ) {
    sample.file ( function( file ) {
      var reader = new FileReader();
      reader.onload = function( e ) { 
        // console.log (JSON.parse(e.target.result));
        var local = JSON.parse(e.target.result);
        slack_web_hook = local.slack_web_hook;
        username = local.username;
      };
      reader.readAsText (file, 'utf-8');
    });
  });
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
  // The URL to POST our data to
  var postUrl = slack_web_hook;

  // Set up an asynchronous AJAX POST request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);


  var payload = {
    "text": title + "\n" + url,
    "channel": "#tech",
    "username": username,
    "icon_emoji": ":ghost:"
  };
  var params = 'payload=' + JSON.stringify(payload);

  // Replace any instances of the URLEncoded space char with +
//  params = params.replace(/%20/g, '+');

  // Set correct header for form data 
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // Handle request state change events
  xhr.onreadystatechange = function() { 
    // If the request completed
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        console.log('Saved!');
        sendResponse({message: "Saved!"});
      } else {
        console.log('Error saving: ' + xhr.statusText);
        sendResponse({message: 'Error saving: ' + xhr.statusText});
      }
    }
  };
  // Send the request and set status
  xhr.send(params);
}