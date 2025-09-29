// UBC125XLT Scanner Configuration Application
class ScannerConfig {
    constructor() {
        this.selectedFrequencies = new Set();
        this.selectedGroups = new Set();
        this.MAX_CHANNELS = 500;
        this.limitWarned = false;
        this.renderRetries = 0;
        this.init();
    }

    init() {
        this.tryRenderGroups();
        this.attachEventListeners();
        this.updateSummary();
    }

    tryRenderGroups() {
        const db = (typeof window !== 'undefined' && window.frequencyDatabase) ? window.frequencyDatabase : null;
        if (!db || Object.keys(db).length === 0) {
            if (this.renderRetries < 40) { // retry up to ~2s total at 50ms
                this.renderRetries++;
                setTimeout(() => this.tryRenderGroups(), 50);
            } else {
                const container = document.getElementById('frequencyGroups');
                if (container) container.innerHTML = '<div style="color:#900">Failed to load frequency database.</div>';
            }
            return;
        }
        this.renderGroups();
    }

    renderGroups() {
        const container = document.getElementById('frequencyGroups');
        container.innerHTML = '';

        const db = (typeof window !== 'undefined' && window.frequencyDatabase) ? window.frequencyDatabase : {};
        Object.entries(db).forEach(([groupId, group]) => {
            const groupCard = this.createGroupCard(groupId, group);
            container.appendChild(groupCard);
        });
    }

    createGroupCard(groupId, group) {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.dataset.groupId = groupId;

        card.innerHTML = `
            <div class="group-header" onclick="scannerConfig.toggleGroup('${groupId}')">
                <div class="group-title">
                    <i class="${group.icon}"></i>
                    <span>${group.name} (${(group.frequencies || []).length})</span>
                </div>
                <div class="group-toggle" id="toggle-${groupId}"></div>
            </div>
            <div class="frequency-list" id="list-${groupId}">
                ${group.frequencies.map(freq => this.createFrequencyItem(groupId, freq)).join('')}
            </div>
        `;

        return card;
    }

    createFrequencyItem(groupId, frequency) {
        const freqId = `${groupId}-${frequency.freq}`;
        return `
            <div class="frequency-item">
                <div class="frequency-info">
                    <div class="frequency-value">${frequency.freq} MHz</div>
                    <div class="frequency-description">${frequency.description}</div>
                </div>
                <input type="checkbox" 
                       class="frequency-checkbox" 
                       id="freq-${freqId}"
                       data-group="${groupId}"
                       data-frequency='${JSON.stringify(frequency)}'
                       onchange="scannerConfig.toggleFrequency('${freqId}', this)">
            </div>
        `;
    }

    toggleGroup(groupId) {
        const toggle = document.getElementById(`toggle-${groupId}`);
        const list = document.getElementById(`list-${groupId}`);
        const card = document.querySelector(`[data-group-id="${groupId}"]`);
        
        if (this.selectedGroups.has(groupId)) {
            // Deselect group
            this.selectedGroups.delete(groupId);
            toggle.classList.remove('active');
            list.classList.remove('show');
            card.classList.remove('selected');
            
            // Uncheck all frequencies in this group
            const checkboxes = list.querySelectorAll('.frequency-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                this.selectedFrequencies.delete(checkbox.id.replace('freq-', ''));
            });
        } else {
            // Select group
            this.selectedGroups.add(groupId);
            toggle.classList.add('active');
            list.classList.add('show');
            card.classList.add('selected');
            
            // Check all frequencies in this group
            const checkboxes = list.querySelectorAll('.frequency-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                this.selectedFrequencies.add(checkbox.id.replace('freq-', ''));
            });
        }

        this.updateSummary();
    }

    toggleFrequency(freqId, checkbox) {
        if (checkbox.checked) {
            this.selectedFrequencies.add(freqId);
        } else {
            this.selectedFrequencies.delete(freqId);
            
            // If unchecking a frequency, also uncheck the group if it was selected
            const groupId = checkbox.dataset.group;
            if (this.selectedGroups.has(groupId)) {
                this.selectedGroups.delete(groupId);
                const toggle = document.getElementById(`toggle-${groupId}`);
                const card = document.querySelector(`[data-group-id="${groupId}"]`);
                toggle.classList.remove('active');
                card.classList.remove('selected');
            }
        }

        this.updateSummary();
    }

    selectAllGroups() {
        const db = (typeof window !== 'undefined' && window.frequencyDatabase) ? window.frequencyDatabase : {};
        Object.keys(db).forEach(groupId => {
            if (!this.selectedGroups.has(groupId)) {
                this.toggleGroup(groupId);
            }
        });
    }

    clearAll() {
        // Clear all selections
        this.selectedFrequencies.clear();
        this.selectedGroups.clear();

        // Update UI
        document.querySelectorAll('.group-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        document.querySelectorAll('.frequency-list').forEach(list => {
            list.classList.remove('show');
        });
        document.querySelectorAll('.group-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.frequency-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.updateSummary();
    }

    updateSummary() {
        document.getElementById('selectedCount').textContent = this.selectedFrequencies.size;
        document.getElementById('groupCount').textContent = this.selectedGroups.size;

        // Warn if over max channels
        if (this.selectedFrequencies.size > this.MAX_CHANNELS) {
            if (!this.limitWarned) {
                this.showNotification(`Selected ${this.selectedFrequencies.size} > ${this.MAX_CHANNELS}. Only ${this.MAX_CHANNELS} can be exported.`, 'info');
                this.limitWarned = true;
            }
        } else if (this.limitWarned) {
            // Reset warning guard when user goes back under the limit
            this.limitWarned = false;
        }
    }

    async generateConfigFile() {
        if (this.selectedFrequencies.size === 0) {
            alert('Please select at least one frequency before downloading.');
            return null;
        }

        if (this.selectedFrequencies.size > this.MAX_CHANNELS) {
            alert(`You selected ${this.selectedFrequencies.size} items. The configuration supports a maximum of ${this.MAX_CHANNELS}. Please reduce your selection.`);
            return null;
        }

        // Helper to format frequency: remove '.', ensure 8 digits with a leading 0
        const toEightDigitFreq = (freqStr) => {
            const digits = String(freqStr).replace(/\D/g, '');
            let d = digits;
            if (d.length > 7) d = d.slice(0, 7);
            if (d.length < 7) d = d.padEnd(7, '0');
            return '0' + d;
        };

        // Collect selected frequencies from all groups
        const compiledLines = [];
        this.selectedFrequencies.forEach(freqId => {
            const checkbox = document.getElementById(`freq-${freqId}`);
            if (checkbox && checkbox.checked) {
                const frequency = JSON.parse(checkbox.dataset.frequency);
                const modulation = frequency.modulation || 'AM';
                const freqDigits = toEightDigitFreq(frequency.freq);
                compiledLines.push(`${frequency.description},${freqDigits},${modulation},0,2,0,0`);
            }
        });

        if (compiledLines.length === 0) {
            alert('Please select at least one frequency before downloading.');
            return null;
        }

        // Fetch header and footer files
        let headerText = '';
        let footerText = '';
        try {
            const [hdrRes, ftrRes] = await Promise.all([
                fetch('header.txt'),
                fetch('footer.txt')
            ]);
            if (!hdrRes.ok || !ftrRes.ok) throw new Error('Failed to load header/footer');
            headerText = await hdrRes.text();
            footerText = await ftrRes.text();
            if (!headerText.endsWith('\n')) headerText += '\n';
        } catch (e) {
            alert('Unable to load header/footer. Please serve the app via a local web server and try again.');
            return null;
        }

        const middle = compiledLines.join('\n') + '\n';
        return `${headerText}${middle}${footerText}`;
    }

    async downloadConfig() {
        const configData = await this.generateConfigFile();
        if (!configData) return;

        const blob = new Blob([configData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.style.display = 'none';
        a.href = url;
        a.download = 'ubc125xlt.txt';

        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Show success message
        this.showNotification('UBC125XLT config file downloaded successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    attachEventListeners() {
        document.getElementById('selectAll').addEventListener('click', () => {
            this.selectAllGroups();
        });

        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAll();
        });

        document.getElementById('downloadConfig').addEventListener('click', async () => {
            await this.downloadConfig();
        });
    }
}

// Initialize the application
let scannerConfig;
document.addEventListener('DOMContentLoaded', () => {
    scannerConfig = new ScannerConfig();
    if (typeof window !== 'undefined') {
        window.scannerConfig = scannerConfig;
    }
});