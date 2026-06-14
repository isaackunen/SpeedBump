// Confirmation page script

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('url');
const matchedRule = urlParams.get('rule');

// Display the information
document.getElementById('target-url').textContent = targetUrl || 'Unknown';
document.getElementById('matched-rule').textContent = matchedRule || 'Unknown';

// Handle confirm button
document.getElementById('confirm-btn').addEventListener('click', async () => {
  if (targetUrl) {
    // Notify background script to navigate to the URL
    try {
      await browser.runtime.sendMessage({
        action: 'navigateToUrl',
        url: targetUrl
      });
    } catch (e) {
      console.error('[SpeedBump] Failed to send navigation message:', e);
    }
  }
});

// Handle cancel button
document.getElementById('cancel-btn').addEventListener('click', () => {
  // Go back in history or close tab
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.close();
  }
});

// Focus cancel so Enter activates it by default (the safe choice).
document.getElementById('cancel-btn').focus();
