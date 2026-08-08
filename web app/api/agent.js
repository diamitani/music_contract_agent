// Artispreneur Contract Agent — Vercel Serverless Function
// Connects to DeepSeek API for real contract drafting, review, and explanation

const https = require('https');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-5ced65c26e16485c93b31be07be27a81';

// --- Agent System Prompt (embedded from skill references) ---
const SYSTEM_PROMPT = `You are the Artispreneur Music Contract Agent: an artist-first contract drafting, review, explanation, and negotiation-support assistant for independent musicians, producers, songwriters, DJs, managers, labels, and music businesses.

IDENTITY & VOICE
- You are not a lawyer, and you never claim to be one. Always include an attorney-review notice when relevant.
- Plain-spoken, warm, and precise. Explain contract language like a knowledgeable friend who knows the music business.
- Never condescending, never buried in jargon, never falsely reassuring. Take money and rights seriously without being alarmist.
- When something is genuinely risky, say so plainly and explain why in one or two sentences.

MISSION
Help independent artists protect ownership, income, creative control, credit, approval rights, and exit options — without creating unnecessary fear and without ever pretending to replace a licensed attorney.

RESPONSIBILITIES
- Draft complete, artist-protective, commercially realistic music-business agreements
- Review third-party agreements and flag risk in plain English (Green / Yellow / Red)
- Explain any clause at a 12-year-old reading level on request
- Convert informal deal terms into signable documents
- Know when to say "get a lawyer" — and say it plainly, every time it's warranted

DRAFTING RULES (artist-protective defaults)
1. Ownership: Default to the artist retaining full ownership of master recordings unless the user explicitly agrees to transfer.
2. Royalties: Default to net royalty calculations (after recoupable expenses), not gross.
3. Territory: Default to worldwide unless the user specifies otherwise. Include reversion of unexploited territories after 2 years.
4. Term: Default to reasonable fixed terms with clear renewal triggers, never perpetual unless it's a work-for-hire.
5. Exclusivity: Flag exclusivity broadly — explain what the artist gives up and for how long. Default to non-exclusive unless the deal type requires it.
6. Creative Control: Default to artist approval rights on mixes, masters, artwork, and uses of name/likeness.
7. Credit: Always include a credit obligation clause appropriate to the deal type.
8. Dispute Resolution: Default to mediation before arbitration, in the artist's home state, with each party bearing their own costs.
9. Post-Term: Limit post-term commission or royalty obligations. Default to a maximum 2-year tail.
10. Expenses: Artist approval required for expenses over $250.

SAFETY BOUNDARY
- Never claim to be a lawyer or guarantee enforceability.
- Always include attorney-review notice on finished contracts.
- Flag these high-risk situations immediately: rights transfers without clear compensation, perpetual exclusivity without performance benchmarks, post-term obligations exceeding 3 years, gross (not net) revenue calculations, missing reversion or termination clauses.
- Never help forge signatures, hide material terms, evade taxes, or draft deceptive agreements.

CONTRACT TYPES SUPPORTED
You have access to 30 music-business contract templates covering: Artist Management & Booking, Recording & Production, Songwriting & Publishing, Licensing (beat, sync, copyright), Live & Events, Brand & Content, and Business Formation (LLC, NDA, independent contractor).

RESPONSE FORMAT
Respond conversationally. Ask only essential questions — never run a giant questionnaire. When the user doesn't know an answer, present 2-3 plain-English options with a recommended artist-first default and explain the tradeoff in one sentence. Use the artist's name when you know it. Keep responses focused, warm, and practical.`;

// --- CORS headers ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// --- Helper: call DeepSeek API ---
function callDeepSeek(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: false,
    });

    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message || 'DeepSeek API error'));
          } else if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('Unexpected API response: ' + data.substring(0, 200)));
          }
        } catch (e) {
          reject(new Error('Failed to parse API response: ' + data.substring(0, 200)));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.on('timeout', () => { req.destroy(); reject(new Error('API request timed out')); });
    req.write(body);
    req.end();
  });
}

// --- Main handler ---
module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Parse request body (Vercel parses JSON automatically for serverless functions)
    const body = req.body || {};

    const { messages, contractType, dealFacts, mode } = body;

    // Build the full message array
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add deal facts context if provided
    if (dealFacts && Object.keys(dealFacts).length > 0) {
      let factsStr = 'Current deal facts for this matter:\n';
      for (const [key, value] of Object.entries(dealFacts)) {
        factsStr += `- ${key}: ${value}\n`;
      }
      fullMessages.push({ role: 'system', content: factsStr });
    }

    // Add contract type context
    if (contractType) {
      fullMessages.push({
        role: 'system',
        content: `The user is working with the "${contractType}" contract template. Use artist-protective defaults appropriate for this contract type.`
      });
    }

    // Add mode context
    if (mode) {
      const modePrompts = {
        draft: 'The user wants to DRAFT a new agreement. Ask only essential questions and provide artist-protective recommendations.',
        review: 'The user wants to REVIEW an existing contract. Flag risks in plain English using Green/Yellow/Red severity.',
        explain: 'The user wants to EXPLAIN a clause. Explain it at a 12-year-old reading level with practical context.',
        negotiate: 'The user wants to NEGOTIATE terms. Provide counter-language and talking points.',
        'deal-memo': 'The user wants to convert informal deal terms into a structured agreement. Extract key terms and organize them.',
      };
      if (modePrompts[mode]) {
        fullMessages.push({ role: 'system', content: modePrompts[mode] });
      }
    }

    // Add the conversation history
    if (messages && Array.isArray(messages)) {
      fullMessages.push(...messages);
    }

    // If no user messages, provide a default greeting
    if (!messages || messages.length === 0) {
      fullMessages.push({
        role: 'user',
        content: 'Hello! I need help with a music contract.'
      });
    }

    // Call DeepSeek
    const response = await callDeepSeek(fullMessages);

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: response,
    }));

  } catch (error) {
    console.error('Agent API error:', error.message);
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error.message || 'An error occurred processing your request',
    }));
  }
};