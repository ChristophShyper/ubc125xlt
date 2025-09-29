// Frequency database - organized by groups for easy maintenance
const frequencyDatabase = {
    "pl-ems": {
            name: "PL Emergency Services",
            icon: "fas fa-ambulance",
            description: "Polish EMS and other emergency services",
            frequencies: [
                { freq: "129.0000", description: "HEMS - LPR" },
            ]
        },
    "pl-airports": {
        name: "PL Civilian Airports",
        icon: "fas fa-plane-departure",
        description: "Bigger Polish civilian airports",
        frequencies: [
            { freq: "154.2650", description: "Fire Dispatch" },
            { freq: "154.2800", description: "Fire Tactical 1" },
            { freq: "154.2950", description: "Fire Tactical 2" },
            { freq: "155.3400", description: "Fire Command" },
            { freq: "453.2375", description: "Fire Repeater" },
            { freq: "460.5500", description: "Fire Mobile" },
            { freq: "154.4300", description: "Mutual Aid" }
        ]
    },
    "pl-airfields": {
        name: "PL Airfields",
        icon: "fas fa-plane",
        description: "Smaller Polish airfields",
        frequencies: [
            { freq: "118.1000", description: "Airport Control Tower" },
            { freq: "121.5000", description: "Emergency Guard" },
            { freq: "122.0000", description: "Flight Service" },
            { freq: "122.9000", description: "Unicom" },
            { freq: "125.3500", description: "Approach Control" },
            { freq: "132.4500", description: "Ground Control" },
            { freq: "243.0000", description: "Military Emergency" }
        ]
    },
    "pl-military": {
            name: "PL Military Airfields",
            icon: "fas fa-fighter-jet",
            description: "Polish military airfields",
            frequencies: [
                { freq: "118.1000", description: "Airport Control Tower" },
                { freq: "121.5000", description: "Emergency Guard" },
                { freq: "122.0000", description: "Flight Service" },
                { freq: "122.9000", description: "Unicom" },
                { freq: "125.3500", description: "Approach Control" },
                { freq: "132.4500", description: "Ground Control" },
                { freq: "243.0000", description: "Military Emergency" }
            ]
        }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = frequencyDatabase;
}