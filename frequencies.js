// Frequency database - organized by groups for easy maintenance
const frequencyDatabase = {
    "police": {
        name: "Police",
        icon: "fas fa-shield-alt",
        description: "Local and state police frequencies",
        frequencies: [
            { freq: "155.7550", description: "Police Dispatch 1", toneCode: "CSQ" },
            { freq: "155.7600", description: "Police Dispatch 2", toneCode: "CSQ" },
            { freq: "155.7750", description: "Police Tactical", toneCode: "131.8" },
            { freq: "154.7700", description: "State Police", toneCode: "CSQ" },
            { freq: "155.4750", description: "Highway Patrol", toneCode: "110.9" },
            { freq: "155.8800", description: "Metro Police", toneCode: "CSQ" },
            { freq: "453.2125", description: "Police Repeater", toneCode: "123.0" },
            { freq: "460.2500", description: "Police Mobile", toneCode: "CSQ" }
        ]
    },
    "fire": {
        name: "Fire Department",
        icon: "fas fa-fire",
        description: "Fire and rescue services",
        frequencies: [
            { freq: "154.2650", description: "Fire Dispatch", toneCode: "CSQ" },
            { freq: "154.2800", description: "Fire Tactical 1", toneCode: "136.5" },
            { freq: "154.2950", description: "Fire Tactical 2", toneCode: "141.3" },
            { freq: "155.3400", description: "Fire Command", toneCode: "CSQ" },
            { freq: "453.2375", description: "Fire Repeater", toneCode: "127.3" },
            { freq: "460.5500", description: "Fire Mobile", toneCode: "CSQ" },
            { freq: "154.4300", description: "Mutual Aid", toneCode: "CSQ" }
        ]
    },
    "ems": {
        name: "Emergency Medical",
        icon: "fas fa-ambulance",
        description: "EMS and medical emergency services",
        frequencies: [
            { freq: "155.3400", description: "EMS Dispatch", toneCode: "CSQ" },
            { freq: "155.3550", description: "EMS Tactical", toneCode: "146.2" },
            { freq: "462.9750", description: "Ambulance to Hospital", toneCode: "CSQ" },
            { freq: "463.0000", description: "Medical Emergency", toneCode: "151.4" },
            { freq: "155.4000", description: "Paramedic", toneCode: "CSQ" },
            { freq: "453.1375", description: "Life Flight", toneCode: "114.8" }
        ]
    },
    "aviation": {
        name: "Aviation",
        icon: "fas fa-plane",
        description: "Airport and aircraft communications",
        frequencies: [
            { freq: "118.1000", description: "Airport Control Tower", toneCode: "CSQ" },
            { freq: "121.5000", description: "Emergency Guard", toneCode: "CSQ" },
            { freq: "122.0000", description: "Flight Service", toneCode: "CSQ" },
            { freq: "122.9000", description: "Unicom", toneCode: "CSQ" },
            { freq: "125.3500", description: "Approach Control", toneCode: "CSQ" },
            { freq: "132.4500", description: "Ground Control", toneCode: "CSQ" },
            { freq: "243.0000", description: "Military Emergency", toneCode: "CSQ" }
        ]
    },
    "marine": {
        name: "Marine",
        icon: "fas fa-ship",
        description: "Coast Guard and marine communications",
        frequencies: [
            { freq: "156.8000", description: "Marine VHF Ch 16", toneCode: "CSQ" },
            { freq: "156.0500", description: "Marine VHF Ch 01", toneCode: "CSQ" },
            { freq: "156.3000", description: "Marine VHF Ch 06", toneCode: "CSQ" },
            { freq: "157.1000", description: "Marine VHF Ch 22", toneCode: "CSQ" },
            { freq: "161.9750", description: "Coast Guard", toneCode: "CSQ" },
            { freq: "165.7375", description: "Coast Guard SAR", toneCode: "CSQ" }
        ]
    },
    "business": {
        name: "Business",
        icon: "fas fa-building",
        description: "Business and industrial frequencies",
        frequencies: [
            { freq: "151.8200", description: "Business Repeater 1", toneCode: "CSQ" },
            { freq: "151.9550", description: "Business Repeater 2", toneCode: "103.5" },
            { freq: "464.5000", description: "UHF Business", toneCode: "CSQ" },
            { freq: "467.8750", description: "GMRS Channel 1", toneCode: "CSQ" },
            { freq: "467.9250", description: "GMRS Channel 6", toneCode: "CSQ" },
            { freq: "462.5625", description: "FRS Channel 1", toneCode: "CSQ" },
            { freq: "462.5875", description: "FRS Channel 2", toneCode: "CSQ" }
        ]
    },
    "railroad": {
        name: "Railroad",
        icon: "fas fa-train",
        description: "Railroad and transit communications",
        frequencies: [
            { freq: "160.2300", description: "Railroad Dispatch", toneCode: "CSQ" },
            { freq: "160.9200", description: "Railroad Yard", toneCode: "CSQ" },
            { freq: "161.1000", description: "Railroad Road", toneCode: "CSQ" },
            { freq: "161.5200", description: "Railroad Maintenance", toneCode: "CSQ" },
            { freq: "452.9375", description: "Transit Operations", toneCode: "CSQ" }
        ]
    },
    "utility": {
        name: "Utilities",
        icon: "fas fa-bolt",
        description: "Electric, gas, and water utilities",
        frequencies: [
            { freq: "151.1750", description: "Electric Utility", toneCode: "CSQ" },
            { freq: "151.2500", description: "Gas Utility", toneCode: "CSQ" },
            { freq: "453.7125", description: "Water Utility", toneCode: "CSQ" },
            { freq: "460.0250", description: "Public Works", toneCode: "CSQ" },
            { freq: "464.1750", description: "Maintenance", toneCode: "CSQ" }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = frequencyDatabase;
}