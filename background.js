let isEnabled = true;
let focusModeActive = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: [],
    isEnabled: true,
    focusMode: {
      active: false,
      duration: 25,
      sites: []
    }
  });
});

async function updateRules() {
  const data = await chrome.storage.local.get(['blockedSites', 'isEnabled', 'focusMode']);
  const sites = [...data.blockedSites];
  
  if (data.focusMode.active) {
    sites.push(...data.focusMode.sites);
  }
  
  if (!data.isEnabled) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: sites.map((_, index) => index + 1)
    });
    return;
  }

  const rules = sites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: site,
      resourceTypes: ["main_frame"]
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((rule) => rule.id),
    addRules: rules
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusModeEnd') {
    chrome.storage.local.get('focusMode', (data) => {
      data.focusMode.active = false;
      chrome.storage.local.set({ focusMode: data.focusMode });
    });
  }
});
