// Background script for SpeedBump extension

let confirmList = [];

// Load confirm list from storage
async function loadConfirmList() {
  const result = await browser.storage.local.get('confirmList');
  confirmList = result.confirmList || [];
  console.debug('[SpeedBump] Loaded confirm list:', confirmList);
}

// Check if a URL matches any rule in the confirm list
function matchesConfirmList(url) {
  try {
    const hostnameLower = new URL(url).hostname.toLowerCase();

    for (const rule of confirmList) {
      const ruleLower = rule.trim().toLowerCase();
      if (!ruleLower) continue;

      // Simple matching: check if hostname contains the rule
      // e.g., "reddit.com" matches "www.reddit.com", "old.reddit.com", "reddit.com"
      if (hostnameLower === ruleLower || hostnameLower.endsWith('.' + ruleLower)) {
        return rule;
      }
    }
  } catch (e) {
    console.error('[SpeedBump] Error matching URL:', e);
  }
  return null;
}

// Maps tabId → matched rule for tabs that have confirmed navigation.
// Keyed by rule (not URL) so HTTP redirects within the same domain
// don't re-trigger the confirmation dialog.
const pendingConfirmations = new Map();

// Listen for navigation requests
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Only process main frame requests (actual page navigations)
    if (details.type !== "main_frame") {
      return {};
    }
    
    // Skip if this is a confirmation page
    if (details.url.startsWith(browser.runtime.getURL('confirm.html'))) {
      return {};
    }
    
    // Skip if this tab has a pending confirmation for a rule matching
    // this URL (handles redirect chains within the same domain).
    const pendingRule = pendingConfirmations.get(details.tabId);
    if (pendingRule !== undefined && matchesConfirmList(details.url) === pendingRule) {
      console.debug('[SpeedBump] Allowing navigation (pending rule match):', details.url);
      return {};
    }
    
    console.debug('[SpeedBump] Checking URL:', details.url);
    
    // Check if URL matches confirm list
    const matchedRule = matchesConfirmList(details.url);
    
    if (matchedRule) {
      console.debug('[SpeedBump] URL matches confirm list:', details.url, 'Rule:', matchedRule);
      
      // Redirect to confirmation page
      const confirmUrl = browser.runtime.getURL('confirm.html') + 
        '?url=' + encodeURIComponent(details.url) + 
        '&rule=' + encodeURIComponent(matchedRule);
      
      return { redirectUrl: confirmUrl };
    }
    
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Listen for messages from confirm page
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'navigateToUrl') {
    const url = message.url;

    // Only allow http/https.
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        sendResponse({ success: false });
        return true;
      }
    } catch (e) {
      sendResponse({ success: false });
      return true;
    }

    // Add tab to pending confirmations keyed by matched rule.
    const matchedRule = matchesConfirmList(url);
    if (!matchedRule) {
      sendResponse({ success: false });
      return true;
    }

    // Guard against a message that didn't originate from a tab.
    const tabId = sender.tab ? sender.tab.id : undefined;
    if (tabId === undefined) {
      sendResponse({ success: false });
      return true;
    }

    pendingConfirmations.set(tabId, matchedRule);
    console.debug('[SpeedBump] Added to pending confirmations:', tabId, matchedRule);

    // Navigate the tab directly from background script. The tab may be
    // closed between the check above and here, in which case the update
    // rejects; catch it so it doesn't surface as an unhandled rejection.
    browser.tabs.update(tabId, { url: url }).then(() => {
      console.debug('[SpeedBump] Navigation initiated to:', url);
    }).catch((e) => {
      console.error('[SpeedBump] Failed to navigate tab (likely closed):', e);
    }).finally(() => {
      // Clean up after navigation settles (or fails)
      setTimeout(() => {
        pendingConfirmations.delete(tabId);
        console.debug('[SpeedBump] Removed from pending confirmations:', tabId);
      }, 10000);
    });

    sendResponse({ success: true });
  }
  return true;
});

// Listen for storage changes
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.confirmList) {
    loadConfirmList();
  }
});

// Open options page when browser action is clicked
browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});

// Initialize
loadConfirmList();
