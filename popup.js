async function loadSettings() {
  const data = await chrome.storage.local.get(['blockedSites', 'isEnabled', 'focusMode']);
  
  document.getElementById('extensionToggle').checked = data.isEnabled;
  updateSiteList(data.blockedSites);
  
  if (data.focusMode.active) {
    document.getElementById('focusTimer').textContent = 'Focus mode active';
    document.getElementById('startFocus').textContent = 'Stop Focus';
  }
}

async function toggleExtension() {
  const isEnabled = document.getElementById('extensionToggle').checked;
  await chrome.storage.local.set({ isEnabled });
  updateRules();
}

async function startFocusMode() {
  const duration = parseInt(document.getElementById('focusDuration').value);
  const data = await chrome.storage.local.get('focusMode');
  
  data.focusMode.active = !data.focusMode.active;
  data.focusMode.duration = duration;
  data.focusMode.sites = ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'];
  
  await chrome.storage.local.set({ focusMode: data.focusMode });
  
  if (data.focusMode.active) {
    chrome.alarms.create('focusModeEnd', { delayInMinutes: duration });
    document.getElementById('startFocus').textContent = 'Stop Focus';
  } else {
    chrome.alarms.clear('focusModeEnd');
    document.getElementById('startFocus').textContent = 'Start Focus Mode';
  }
  
  updateRules();
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  document.getElementById('extensionToggle').addEventListener('change', toggleExtension);
  document.getElementById('addSite').addEventListener('click', addSite);
  document.getElementById('startFocus').addEventListener('click', startFocusMode);
});