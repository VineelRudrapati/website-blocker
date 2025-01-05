let blockedSites = [
    "*://*.facebook.com/*",
    "*://*.twitter.com/*",
    "*://*.instagram.com/*",
    "*://*.vidu.studio/*",
    "https://tempmailo.com/"
  ];
  
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      return {cancel: true};
    },
    {urls: blockedSites},
    ["blocking"]
  );
  