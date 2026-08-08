// ============================
// Artispreneur Contract Agent
// Shared JS Framework
// ============================

// ----- Toast Notifications -----
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i data-lucide="${icons[type] || 'check-circle'}"></i> ${message}`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----- Modal -----
function showModal(title, message, actions = []) {
  // Remove existing modal
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  let actionsHTML = actions.map((a, i) =>
    `<button class="btn ${a.primary ? 'btn-primary' : 'btn-ghost'} modal-action-${i}">${a.label}</button>`
  ).join('');

  overlay.innerHTML = `
    <div class="modal">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="modal-actions">${actionsHTML}</div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  // Bind actions
  const modal = overlay.querySelector('.modal');
  actions.forEach((a, i) => {
    const btn = modal.querySelector(`.modal-action-${i}`);
    if (btn) {
      btn.addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 200);
        if (a.onClick) a.onClick();
      });
    }
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 200);
    }
  });

  // Close on Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 200);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// ----- Command Palette -----
function initCommandPalette() {
  let overlay = document.querySelector('.cmd-palette-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cmd-palette-overlay';
    overlay.innerHTML = `
      <div class="cmd-palette">
        <input class="cmd-input" type="text" placeholder="Search contracts, documents, deal facts...">
        <div class="cmd-results">
          <div class="cmd-item" data-action="draft">
            <i data-lucide="file-plus"></i> Draft a New Contract <span class="cmd-item-shortcut">⌘N</span>
          </div>
          <div class="cmd-item" data-action="review">
            <i data-lucide="search"></i> Review an Agreement <span class="cmd-item-shortcut">⌘R</span>
          </div>
          <div class="cmd-item" data-action="library">
            <i data-lucide="book-open"></i> Browse Contract Library
          </div>
          <div class="cmd-item" data-action="documents">
            <i data-lucide="folder"></i> My Documents
          </div>
          <div class="cmd-item" data-action="deal-facts">
            <i data-lucide="user"></i> Saved Deal Facts
          </div>
          <div class="cmd-item" data-action="settings">
            <i data-lucide="settings"></i> Settings
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    lucide.createIcons();
  }

  const input = overlay.querySelector('.cmd-input');
  const items = overlay.querySelectorAll('.cmd-item');

  function open() {
    overlay.classList.add('active');
    input.value = '';
    input.focus();
    // Highlight first item
    if (items.length) items[0].classList.add('selected');
  }

  function close() {
    overlay.classList.remove('active');
    items.forEach(i => i.classList.remove('selected'));
  }

  // Click handlers
  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      handleCommandAction(action);
      close();
    });
  });

  // Arrow key navigation
  let selectedIdx = 0;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[selectedIdx]?.classList.remove('selected');
      selectedIdx = (selectedIdx + 1) % items.length;
      items[selectedIdx]?.classList.add('selected');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[selectedIdx]?.classList.remove('selected');
      selectedIdx = (selectedIdx - 1 + items.length) % items.length;
      items[selectedIdx]?.classList.add('selected');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = items[selectedIdx]?.dataset.action;
      if (action) handleCommandAction(action);
      close();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Global shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('active') ? close() : open();
    }
  });

  return { open, close };
}

function handleCommandAction(action) {
  const routes = {
    draft: () => navigateTo('app', 'workspace'),
    review: () => navigateTo('app', 'review'),
    library: () => navigateTo('app', 'library'),
    documents: () => navigateTo('app', 'documents'),
    'deal-facts': () => navigateTo('app', 'deal-facts'),
    settings: () => navigateTo('app', 'settings'),
  };
  if (routes[action]) routes[action]();
  else showToast('Command executed: ' + action);
}

// ----- App Navigation -----
function navigateTo(page, section) {
  // Store current section
  if (section) sessionStorage.setItem('app-section', section);

  if (page === 'app') {
    const isOnApp = window.location.pathname.includes('app.html');
    if (!isOnApp) {
      window.location.href = 'app.html';
    } else {
      loadAppSection(section || 'dashboard');
    }
  } else if (page === 'landing') {
    window.location.href = 'index.html';
  }
}

function loadAppSection(section) {
  const content = document.getElementById('app-content');
  if (!content) return;

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === section) item.classList.add('active');
  });

  // Fetch and load the partial
  fetch(`partials/app/${section}.html`)
    .then(r => r.text())
    .then(html => {
      content.innerHTML = html;
      lucide.createIcons();
      // Call section-specific init
      if (section === 'contract-workspace' && window.initWorkspace) window.initWorkspace();
      if (section === 'contract-review' && window.initReview) window.initReview();
      if (section === 'contract-library' && window.initLibrary) window.initLibrary();
    })
    .catch(() => {
      content.innerHTML = `
        <div class="empty-state">
          <i data-lucide="alert-circle"></i>
          <h4>Section Coming Soon</h4>
          <p>${section.replace(/-/g, ' ')} is under development and will be available shortly.</p>
        </div>
      `;
      lucide.createIcons();
    });
}

// ----- Drawer -----
function openDrawer(title, bodyHTML) {
  let drawer = document.querySelector('.drawer');
  let overlay = document.querySelector('.drawer-overlay');

  if (!drawer) {
    overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.innerHTML = `
      <div class="drawer-header">
        <h3></h3>
        <button class="drawer-close"><i data-lucide="x"></i></button>
      </div>
      <div class="drawer-body"></div>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    const closeBtn = drawer.querySelector('.drawer-close');
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }

  drawer.querySelector('.drawer-header h3').textContent = title;
  drawer.querySelector('.drawer-body').innerHTML = bodyHTML;

  requestAnimationFrame(() => {
    overlay.classList.add('active');
    drawer.classList.add('active');
  });
  lucide.createIcons();

  document.addEventListener('keydown', function escClose(e) {
    if (e.key === 'Escape') {
      closeDrawer();
      document.removeEventListener('keydown', escClose);
    }
  });
}

function closeDrawer() {
  const drawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// ----- Tabs -----
function initTabs(container) {
  const tabs = container.querySelectorAll('.tab');
  const panels = container.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      panels.forEach(p => {
        p.style.display = p.dataset.panel === target ? 'block' : 'none';
      });
    });
  });

  // Activate first tab
  if (tabs.length) tabs[0].click();
}

// ----- Progress Tracking -----
function advanceProgress(tracker, step) {
  const steps = tracker.querySelectorAll('.progress-step');
  steps.forEach(s => {
    s.classList.remove('completed', 'active');
  });
  steps.forEach((s, i) => {
    const stepNum = parseInt(s.dataset.step);
    if (stepNum < step) s.classList.add('completed');
    if (stepNum === step) s.classList.add('active');
  });
}

// ----- Chip Selection -----
function initChipGroups() {
  document.querySelectorAll('.chip-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip') && !e.target.closest('.chip-row').dataset.multi) {
        row.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');
      }
    });
  });
}

// ----- Initialize on DOM load -----
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Init command palette on all pages
  initCommandPalette();

  // Init chip groups
  initChipGroups();

  // Chat composer expand
  const composer = document.querySelector('.chat-composer textarea');
  if (composer) {
    composer.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
  }

  // File upload zone
  const uploadZone = document.querySelector('.upload-zone');
  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file, uploadZone);
    });
    uploadZone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.docx,.txt,.doc';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file, uploadZone);
      });
      input.click();
    });
  }
});

function handleFileUpload(file, zone) {
  zone.innerHTML = `
    <div style="text-align:center;">
      <i data-lucide="file-text"></i>
      <h4>Extracting ${file.name}</h4>
      <p style="font-size:13px;color:var(--color-text-muted);">Analyzing document structure...</p>
      <div style="margin-top:16px;">
        <div class="skeleton skeleton-text" style="width:100%;"></div>
        <div class="skeleton skeleton-text" style="width:85%;"></div>
        <div class="skeleton skeleton-text" style="width:60%;"></div>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Simulate extraction
  setTimeout(() => {
    zone.innerHTML = `
      <div style="text-align:center;">
        <i data-lucide="check-circle" style="color:var(--color-success);width:48px;height:48px;"></i>
        <h4>${file.name} — Extracted</h4>
        <p style="font-size:13px;color:var(--color-text-muted);">12 clauses identified · 3 parties detected · 2 high-risk items flagged</p>
        <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="navigateTo('app','review')">Begin Review</button>
      </div>
    `;
    lucide.createIcons();
  }, 2000);
}

// ----- Export helpers -----
function toggleDropdown(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  const isOpen = menu.style.display === 'block';
  document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
  menu.style.display = isOpen ? 'none' : 'block';

  // Close on outside click
  if (!isOpen) {
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!menu.contains(e.target)) {
          menu.style.display = 'none';
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 10);
  }
}

// ----- API: Call the Contract Agent via DeepSeek -----
async function callAgent({ messages, contractType, dealFacts, mode }) {
  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, contractType, dealFacts, mode }),
    });
    const data = await res.json();
    if (data.success) {
      return data.message;
    } else {
      throw new Error(data.error || 'Unknown API error');
    }
  } catch (err) {
    console.error('callAgent error:', err);
    throw err;
  }
}

// Make globally available
window.showToast = showToast;
window.showModal = showModal;
window.navigateTo = navigateTo;
window.loadAppSection = loadAppSection;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.advanceProgress = advanceProgress;
window.toggleDropdown = toggleDropdown;
window.initTabs = initTabs;
window.callAgent = callAgent;
