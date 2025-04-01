/**
 * Gemeinsame React-Funktionalitäten für das Portal
 */

// Initial State Management
window.portalState = {
    dashboard: {
        betreuer: {
            maklerCount: 0,
            activeTickets: 0,
            pendingTrainings: 0,
            recentActivities: []
        },
        makler: {
            contracts: 0,
            customers: 0,
            commissions: 0,
            appointments: []
        },
        admin: {
            userCount: 0,
            systemHealth: 'ok',
            lastBackup: null,
            alerts: []
        }
    },
    user: {
        role: null,
        permissions: [],
        settings: {}
    }
};

/**
 * Initialisiert den React-State für ein Modul
 * @param {string} moduleName - Name des Moduls
 * @param {Object} initialData - Initiale Daten für das Modul
 */
function initializeModuleState(moduleName, initialData) {
    try {
        if (!moduleName) throw new Error('Modulname ist erforderlich');
        if (typeof initialData !== 'undefined') {
            window.portalState[moduleName] = initialData;
        }
        return window.portalState[moduleName];
    } catch (error) {
        console.error('Error when parsing Initial State data: ', error);
        return null;
    }
}

/**
 * Aktualisiert den State eines Moduls
 * @param {string} moduleName - Name des Moduls
 * @param {Object} newData - Neue Daten für das Modul
 */
function updateModuleState(moduleName, newData) {
    try {
        if (!moduleName) throw new Error('Modulname ist erforderlich');
        if (!window.portalState[moduleName]) {
            window.portalState[moduleName] = {};
        }
        window.portalState[moduleName] = {
            ...window.portalState[moduleName],
            ...newData
        };
        return window.portalState[moduleName];
    } catch (error) {
        console.error('Error when updating State data: ', error);
        return null;
    }
}

// Event-Handler für State-Änderungen
window.addEventListener('stateChange', (event) => {
    const { module, data } = event.detail;
    updateModuleState(module, data);
});
