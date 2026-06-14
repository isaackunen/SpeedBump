// Options page script

const confirmListTextarea = document.getElementById('confirm-list');
const saveBtn = document.getElementById('save-btn');
const statusMessage = document.getElementById('status-message');

// Load saved settings
async function loadSettings() {
  const result = await browser.storage.local.get('confirmList');
  const confirmList = result.confirmList || [];
  confirmListTextarea.value = confirmList.join('\n');
}

// Save settings
async function saveSettings() {
  const text = confirmListTextarea.value;
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const normalized = [];
  const simplified = [];
  const invalid = [];

  for (const line of lines) {
    try {
      const urlStr = /^https?:\/\//i.test(line) ? line : 'https://' + line;
      const hostname = new URL(urlStr).hostname;
      if (!hostname) throw new Error('empty hostname');
      normalized.push(hostname);
      if (hostname !== line) {
        simplified.push(`${line} → ${hostname}`);
      }
    } catch (e) {
      invalid.push(line);
    }
  }

  await browser.storage.local.set({ confirmList: normalized });
  confirmListTextarea.value = normalized.join('\n');

  if (simplified.length > 0 || invalid.length > 0) {
    let msg = 'Settings saved.';
    if (simplified.length > 0) {
      msg += ` Simplified to hostname only: ${simplified.join('; ')}.`;
    }
    if (invalid.length > 0) {
      msg += ` Removed invalid entries: ${invalid.join(', ')}.`;
    }
    showStatus(msg, 'warning');
  } else {
    showStatus('Settings saved!', 'success');
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message ' + type;
  statusMessage.style.display = 'block';
  
  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
}

// Event listeners
saveBtn.addEventListener('click', saveSettings);

// Save on Ctrl+S or Cmd+S
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveSettings();
  }
});

// Load settings on page load
loadSettings();
