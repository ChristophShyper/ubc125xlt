// Render all frequencies grouped by category and sorted alphabetically
(function(){
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function render() {
    const container = document.getElementById('allFrequencies');
    if (!container) return;

    const db = (typeof window !== 'undefined' && window.frequencyDatabase) ? window.frequencyDatabase : null;
    if (!db || Object.keys(db).length === 0) {
      container.innerHTML = '<div style="padding:20px;color:#900">Frequency database is not available. Please reload the page after it finishes loading.</div>';
      return;
    }

    const groups = Object.entries(db).map(([id, g]) => ({ id, ...g }));

    // Sort groups by display name
    groups.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const sections = groups.map(group => {
      const items = (group.frequencies || []).slice().sort((a, b) => {
        const ad = (a.description || '').toLowerCase();
        const bd = (b.description || '').toLowerCase();
        if (ad === bd) {
          // fallback: sort by numeric frequency
          const af = parseFloat(a.freq || '0');
          const bf = parseFloat(b.freq || '0');
          return af - bf;
        }
        return ad.localeCompare(bd);
      });

      const listHtml = items.map(item => {
        const safeDesc = escapeHtml(item.description || '');
        const safeFreq = escapeHtml(item.freq || '');
        return `
        <div class="frequency-item">
          <div class="frequency-info">
            <div class="frequency-description">${safeDesc}</div>
            <div class="frequency-value">${safeFreq} MHz</div>
          </div>
        </div>`;
      }).join('');

      const safeIcon = escapeHtml(group.icon || '');
      const safeName = escapeHtml(group.name || '');

      return `
        <section class="group-card" aria-label="${safeName}">
          <div class="group-header">
            <div class="group-title">
              <i class="${safeIcon}"></i>
              <span>${safeName} (${items.length})</span>
            </div>
          </div>
          <div class="frequency-list show">
            ${listHtml || '<div class="frequency-item"><div class="frequency-description">No entries</div></div>'}
          </div>
        </section>
      `;
    }).join('');

    container.innerHTML = sections || '<div style="padding:20px">No frequency groups found.</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
