// ============================
// Workspace Interactions
// ============================

function sendWorkspaceMessage() {
  const input = document.getElementById('wsComposerInput');
  if (!input || !input.value.trim()) return;

  const msg = input.value.trim();
  input.value = '';
  input.style.height = 'auto';

  const chat = document.getElementById('wsChat');
  if (!chat) return;

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'ws-msg-group user';
  userMsg.innerHTML = `
    <span class="ws-msg-label">You</span>
    <div class="ws-msg-card" style="background:var(--color-crimson);color:var(--color-white);border:none;">
      <p>${msg}</p>
    </div>
  `;
  chat.appendChild(userMsg);

  // Show loading
  const loading = document.getElementById('wsLoading');
  if (loading) loading.style.display = 'flex';
  chat.scrollTop = chat.scrollHeight;

  // Simulate agent response
  setTimeout(() => {
    if (loading) loading.style.display = 'none';

    const agentMsg = document.createElement('div');
    agentMsg.className = 'ws-msg-group agent';
    agentMsg.innerHTML = `
      <span class="ws-msg-label">Contract Agent</span>
      <div class="ws-msg-card agent-msg">
        <p>Got it — I've updated the deal facts with your input. We're making great progress on this Producer Agreement.</p>
        <p>The next topic to cover: <strong>delivery timeline</strong>. When do you need Dominic to deliver the finished master for "Midnight Drive"?</p>
      </div>
    `;
    chat.appendChild(agentMsg);
    chat.scrollTop = chat.scrollHeight;
    showToast('Deal facts updated', 'success');
  }, 1800);
}

// Initialize when workspace loads
window.initWorkspace = function() {
  // Any workspace-specific init
};