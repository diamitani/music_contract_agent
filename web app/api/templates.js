// Artispreneur Contract Agent — Templates API
// Returns the contract library index for the frontend

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const TEMPLATES = [
  { id: 'artist-management', name: 'Artist Management Agreement', category: 'Artist & Management', time: '15 min', description: 'Full manager-artist relationship: commissions, term, exclusivity, expenses, post-term', riskAreas: ['commission_rate', 'post_term_tail', 'exclusivity_scope'] },
  { id: 'booking-agent', name: 'Booking / Talent Agent Agreement', category: 'Artist & Management', time: '12 min', description: 'Agent representation for live shows and tours with commission structure', riskAreas: ['territory', 'exclusivity', 'commission_rate'] },
  { id: 'artist-booking', name: 'Artist Booking Agreement', category: 'Artist & Management', time: '10 min', description: 'Direct artist booking for a specific show or event — fee, rider, cancellation', riskAreas: ['cancellation', 'force_majeure', 'payment_terms'] },
  { id: 'producer-composer', name: 'Producer / Composer Agreement', category: 'Recording & Production', time: '15 min', description: 'Producer engagement: fee, royalties, ownership, credit, deliverables', riskAreas: ['master_ownership', 'royalty_scope', 'credit'] },
  { id: 'artist-label-recording', name: 'Artist / Label Recording Agreement', category: 'Recording & Production', time: '20 min', description: 'Full recording deal: advances, royalties, options, territory, creative control', riskAreas: ['options', 'ownership', 'recoupment', 'creative_control'] },
  { id: 'producer-royalties', name: 'Producer Royalties Agreement', category: 'Recording & Production', time: '10 min', description: 'Producer royalty structure only — points, recoupment, accounting', riskAreas: ['gross_vs_net', 'recoupment', 'accounting'] },
  { id: 'production-agreement', name: 'Production Agreement', category: 'Recording & Production', time: '15 min', description: 'Producer / production company engagement with deliverables and timeline', riskAreas: ['deadlines', 'payment_schedule', 'ownership'] },
  { id: 'studio-time', name: 'Studio Time Agreement', category: 'Recording & Production', time: '8 min', description: 'Studio session booking: schedule, equipment, payment, recording rights', riskAreas: ['recording_rights', 'cancellation'] },
  { id: 'talent-producer', name: 'Talent / Producer Agreement', category: 'Recording & Production', time: '12 min', description: 'Talent and producer joint engagement with shared responsibilities', riskAreas: ['joint_liability', 'credit', 'ownership'] },
  { id: 'work-for-hire', name: 'Work-for-Hire Agreement', category: 'Recording & Production', time: '10 min', description: 'Full rights transfer — artist owns everything, producer/creator is paid flat', riskAreas: ['rights_transfer', 'credit_omission', 'moral_rights'] },
  { id: 'music-distribution', name: 'Music Distribution Agreement', category: 'Recording & Production', time: '12 min', description: 'Distributor relationship: term, territory, rev share, accounting, reversion', riskAreas: ['term_length', 'exclusivity', 'reversion'] },
  { id: 'songwriter-collaboration', name: 'Songwriter Collaboration Agreement', category: 'Songwriting & Publishing', time: '12 min', description: 'Co-writing arrangement with ownership splits and approval rights', riskAreas: ['split_ambiguity', 'approval_rights'] },
  { id: 'songwriter-split-sheet', name: 'Songwriter Split Sheet', category: 'Songwriting & Publishing', time: '5 min', description: 'PRO-ready split sheet: writer shares, publisher info, IPI/CAE numbers', riskAreas: ['accuracy', 'signatures'] },
  { id: 'split-sheet', name: 'Split Sheet (Simple)', category: 'Songwriting & Publishing', time: '5 min', description: 'Quick split sheet for informal songwriter agreements', riskAreas: ['accuracy'] },
  { id: 'joint-venture-publishing', name: 'Joint Venture Publishing Agreement', category: 'Songwriting & Publishing', time: '15 min', description: 'Co-publishing JV between writer and publisher', riskAreas: ['ownership_structure', 'term', 'administration'] },
  { id: 'sync-master-use', name: 'Sync / Master Use License', category: 'Licensing', time: '10 min', description: 'TV, film, game, and ad sync placement with master + publishing terms', riskAreas: ['territory', 'term', 'exclusivity'] },
  { id: 'copyright-license', name: 'Copyright License Agreement', category: 'Licensing', time: '10 min', description: 'Mechanical/publisher license for cover songs and samples', riskAreas: ['scope', 'royalty_rate', 'term'] },
  { id: 'exclusive-beat-license', name: 'Exclusive Beat License', category: 'Licensing', time: '10 min', description: 'Full exclusive rights to a beat: ownership transfer, streaming caps, buyout', riskAreas: ['ownership_transfer', 'streaming_caps', 'buyout_terms'] },
  { id: 'non-exclusive-beat-license', name: 'Non-Exclusive Beat License', category: 'Licensing', time: '8 min', description: 'Limited license to use a beat with defined streaming/distribution limits', riskAreas: ['streaming_limits', 'territory'] },
  { id: 'merchandise-license', name: 'Merchandise License Agreement', category: 'Brand & Content', time: '10 min', description: 'License to use artist name/likeness on merchandise', riskAreas: ['scope', 'royalty_rate', 'quality_control'] },
  { id: 'brand-sponsorship', name: 'Brand Sponsorship Agreement', category: 'Brand & Content', time: '12 min', description: 'Brand partnership and sponsorship with deliverables and exclusivity', riskAreas: ['exclusivity', 'morals_clause', 'deliverables'] },
  { id: 'influencer-content-creator', name: 'Influencer / Content Creator Agreement', category: 'Brand & Content', time: '12 min', description: 'Content creation deal with posting schedule and usage rights', riskAreas: ['usage_rights', 'exclusivity', 'payment_terms'] },
  { id: 'talent-likeness-release', name: 'Talent Likeness Release Form', category: 'Brand & Content', time: '5 min', description: 'One-page release for use of name, image, and likeness', riskAreas: ['scope', 'duration'] },
  { id: 'videographer-photographer-release', name: 'Videographer / Photographer Release', category: 'Brand & Content', time: '5 min', description: 'Release for footage and photos taken during sessions or events', riskAreas: ['usage_scope', 'credit'] },
  { id: 'dj-booking', name: 'DJ Booking Agreement', category: 'Live & Events', time: '10 min', description: 'DJ performance booking with technical rider and payment terms', riskAreas: ['rider', 'cancellation', 'payment'] },
  { id: 'venue-performance', name: 'Venue Performance Agreement', category: 'Live & Events', time: '12 min', description: 'Artist performance at a venue: fee, rider, promotion, settlement', riskAreas: ['settlement', 'cancellation', 'production'] },
  { id: 'venue-rental', name: 'Venue Rental Contract', category: 'Live & Events', time: '10 min', description: 'Venue rental for events, showcases, or private functions', riskAreas: ['damage_deposit', 'cancellation', 'insurance'] },
  { id: 'llc-operating', name: 'LLC Operating Agreement', category: 'Business & Operations', time: '15 min', description: 'Multi-member LLC operating agreement for music ventures', riskAreas: ['ownership_split', 'decision_making', 'exit'] },
  { id: 'nda-non-circumvention', name: 'NDA / Non-Circumvention Agreement', category: 'Business & Operations', time: '8 min', description: 'Confidentiality and non-circumvention for deal discussions', riskAreas: ['scope', 'term'] },
  { id: 'independent-contractor', name: 'Independent Contractor Agreement', category: 'Business & Operations', time: '10 min', description: 'General independent contractor engagement for music services', riskAreas: ['classification', 'ownership', 'liability'] },
];

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const { search, category } = req.query || {};
  let results = TEMPLATES;

  if (category) {
    results = results.filter(t => t.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }

  // Get unique categories
  const categories = [...new Set(TEMPLATES.map(t => t.category))];

  res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    total: TEMPLATES.length,
    filtered: results.length,
    categories,
    templates: results,
  }));
};