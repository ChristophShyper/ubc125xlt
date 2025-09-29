// UBC125XLT Scanner Configuration Application
class ScannerConfig {
    constructor() {
        this.selectedFrequencies = new Set();
        this.selectedGroups = new Set();
        this.init();
    }

    init() {
        this.renderGroups();
        this.attachEventListeners();
        this.updateSummary();
    }

    renderGroups() {
        const container = document.getElementById('frequencyGroups');
        container.innerHTML = '';

        Object.entries(frequencyDatabase).forEach(([groupId, group]) => {
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
                    <span>${group.name}</span>
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
        Object.keys(frequencyDatabase).forEach(groupId => {
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
    }

    generateConfigFile() {
        if (this.selectedFrequencies.size === 0) {
            alert('Please select at least one frequency before downloading.');
            return;
        }

        const config = {
            scanner: "UBC125XLT",
            generated: new Date().toISOString(),
            channels: []
        };

        let channelNumber = 1;

        // Collect selected frequencies from all groups
        this.selectedFrequencies.forEach(freqId => {
            const checkbox = document.getElementById(`freq-${freqId}`);
            if (checkbox && checkbox.checked) {
                const frequency = JSON.parse(checkbox.dataset.frequency);
                const groupId = checkbox.dataset.group;
                const group = frequencyDatabase[groupId];

                config.channels.push({
                    channel: channelNumber++,
                    frequency: frequency.freq,
                    description: frequency.description,
                    group: group.name,
                    modulation: frequency.modulation || "AM",
                    mode: "FM"
                });
            }
        });

        return this.formatConfigForScanner(config);
    }

    formatConfigForScanner(config) {
        // Generate UBC125XLT compatible configuration
        // This follows a CSV-like format that can be imported into scanner programming software
        let output = "# UBC125XLT Scanner Configuration\n";
        output += `# Generated: ${config.generated}\n`;
        output += "# Channel,Frequency,Description,Group,Modulation,Mode\n";
        output += "\n";

        config.channels.forEach(channel => {
            output += `${channel.channel},${channel.frequency},${channel.description},${channel.group},${channel.modulation},${channel.mode}\n`;
        });

        return output;
    }

    downloadConfig() {
        const configData = this.generateConfigFile();
        if (!configData) return;

        const blob = new Blob([configData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        
        a.style.display = 'none';
        a.href = url;
        a.download = `UBC125XLT-config-${timestamp}.csv`;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Show success message
        this.showNotification('Configuration file downloaded successfully!', 'success');
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

        document.getElementById('downloadConfig').addEventListener('click', () => {
            this.downloadConfig();
        });
    }
}

// Initialize the application
let scannerConfig;
document.addEventListener('DOMContentLoaded', () => {
    scannerConfig = new ScannerConfig();
});