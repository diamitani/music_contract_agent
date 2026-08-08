// ============================
// Workspace Interactions
// Real DeepSeek backend
// ============================

// Conversation state
let workspaceConversation = [];
let workspaceDealFacts = {
  'Artist': 'Marcus Avery (p/k/a "MAV")',
  'Producer': 'Dominic Reyes',
  'Track': '"Midnight Drive"',
  'Contract Type': 'Producer / Composer Agreement',
  'Producer Fee': '$2,500 flat fee',
};

async function sendWorkspaceMessage() {
  const input = document.getElementById('wsComposerInput');
  if (!input || !input.value.trim()) return;

  const msg = input.value.trim();
  input.value = '';
  input.style.height = 'auto';

  const chat = document.getElementById('wsChat');
  if (!chat) return;

  // Add user message to UI
  const userMsg = document.createElement('div');
  userMsg.className = 'ws-msg-group user';
  userMsg.innerHTML = `
    <span class="ws-msg-label">You</span>
    <div class="ws-msg-card" style="background:var(--color-crimson);color:var(--color-white);border:none;">
      <p>${msg}</p>
    </div>
  `;
  chat.appendChild(userMsg);

  // Add user message to conversation history
  workspaceConversation.push({ role: 'user', content: msg });

  // Show loading
  const loading = document.getElementById('wsLoading');
  if (loading) loading.style.display = 'flex';
  chat.scrollTop = chat.scrollHeight;

  try {
    // Call the real DeepSeek API through our serverless function
    const response = await window.callAgent({
      messages: workspaceConversation,
      contractType: workspaceDealFacts['Contract Type'] || null,
      dealFacts: workspaceDealFacts,
      mode: 'draft',
    });

    // Hide loading
    if (loading) loading.style.display = 'none';

    // Add agent response to conversation history
    workspaceConversation.push({ role: 'assistant', content: response });

    // Add agent message to UI
    const agentMsg = document.createElement('div');
    agentMsg.className = 'ws-msg-group agent';

    // Format the response: wrap paragraphs in <p> tags
    const formattedResponse = response
      .split('\n\n')
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');

    agentMsg.innerHTML = `
      <span class="ws-msg-label">Contract Agent</span>
      <div class="ws-msg-card agent-msg">
        ${formattedResponse}
      </div>
    `;
    chat.appendChild(agentMsg);
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    // Hide loading
    if (loading) loading.style.display = 'none';

    // Show error
    const errMsg = document.createElement('div');
    errMsg.className = 'ws-msg-group agent';
    errMsg.innerHTML = `
      <span class="ws-msg-label">Contract Agent</span>
      <div class="ws-msg-card" style="border-left:3px solid var(--color-error);">
        <p>I'm having trouble connecting right now. Please try again in a moment.</p>
        <p style="font-size:12px;color:var(--color-text-muted);">${err.message}</p>
      </div>
    `;
    chat.appendChild(errMsg);
    chat.scrollTop = chat.scrollHeight;
  }
}

// Also make "Enter" key send the message
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.id === 'wsComposerInput') {
    e.preventDefault();
    sendWorkspaceMessage();
  }
});

// Initialize when workspace loads
window.initWorkspace = function() {
  // Initialize conversation with the system context
  workspaceConversation = [];
  const composer = document.getElementById('wsComposerInput');
  if (composer) {
    composer.focus();
  }
};