document.addEventListener('DOMContentLoaded', function() {
    function updateSiteList() {
      const siteList = document.getElementById('siteList');
      siteList.innerHTML = '';
      
      chrome.extension.getBackgroundPage().blockedSites.forEach(site => {
        const siteElement = document.createElement('div');
        siteElement.className = 'site-item';
        siteElement.textContent = site.replace('*://*.', '').replace('/*', '');
        siteList.appendChild(siteElement);
      });
    }
  
    document.getElementById('addSite').addEventListener('click', function() {
      const newSite = document.getElementById('newSite').value.trim();
      if (newSite) {
        const pattern = `*://*.${newSite}/*`;
        chrome.extension.getBackgroundPage().blockedSites.push(pattern);
        document.getElementById('newSite').value = '';
        updateSiteList();
      }
    });
  
    updateSiteList();
  });