// alert(window.location.href);
console.log(window.location.href);

chrome.runtime.sendMessage({title: document.title, url: window.location.href}, function(response) {
   console.log(response.message);
});