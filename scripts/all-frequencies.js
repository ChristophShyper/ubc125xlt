// Render all frequencies grouped by category and sorted alphabetically
(function(){
  function render() {
    const container = document.getElementById('allFrequencies');
    if (!container) return;

    const db = (typeof window !== 'undefined' && window.frequencyDatabase) ? window.frequencyDatabase : {};
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

      const listHtml = items.map(item => `
        <div class="frequency-item">
          <div class="frequency-info">
            <div class="frequency-description">${item.description || ''}</div>
            <div class="frequency-value">${item.freq} MHz</div>
          </div>
        </div>
      `).join('');

      return `
        <section class="group-card" aria-label="${group.name}">
          <div class="group-header">
            <div class="group-title">
              <i class="${group.icon || ''}"></i>
              <span>${group.name} (${items.length})</span>
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
