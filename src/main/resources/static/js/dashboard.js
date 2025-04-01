/**
 * Dashboard Hauptskript
 * Lädt das entsprechende Dashboard basierend auf der Benutzerrolle
 */
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('userRole');
    const prefix = role.toLowerCase();
    
    console.log(`Lade Dashboard für Rolle: ${role} mit Prefix: ${prefix}`);
    
    // Lade das rollenspezifische Dashboard
    router.loadModule(`modules/${prefix}-dashboard.html`);
    
    // Lade die Benutzerinformationen
    loadUserInfo();
    
    // Setze das Menü entsprechend der Rolle
    setMenuForRole(role);
});

/**
 * Lädt die Benutzerinformationen
 */
function loadUserInfo() {
    const role = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    console.log(`Lade Benutzerinfo für: ${username} Rolle: ${role}`);
    
    // Hier können weitere Benutzerinformationen geladen werden
    document.getElementById('userRole').textContent = role;
    document.getElementById('username').textContent = username;
}

/**
 * Setzt das Menü entsprechend der Benutzerrolle
 * @param {string} role - Die Rolle des Benutzers
 */
function setMenuForRole(role) {
    console.log(`Setze Menü für Rolle: ${role}`);
    // Hier kann die Menülogik implementiert werden
    // z.B. Ein- und Ausblenden von Menüpunkten je nach Rolle
}

/**
 * Dashboard-Implementierung mit Vanilla JavaScript
 */

// Dummy-Daten für verschiedene Rollen
const dummyData = {
    betreuer: {
        maklerCount: 25,
        activeTickets: 5,
        pendingTrainings: 3,
        recentActivities: [
            { title: 'Neue Schulung', date: '2025-04-01', description: 'Produktschulung für Versicherung XY' },
            { title: 'Support-Ticket', date: '2025-04-01', description: 'Neues Ticket von Makler Schmidt' }
        ]
    },
    makler: {
        contracts: 150,
        customers: 75,
        commissions: 12500,
        appointments: [
            { title: 'Kundentermin', date: '2025-04-02', description: 'Beratungsgespräch mit Familie Müller' },
            { title: 'Schulung', date: '2025-04-03', description: 'Online-Schulung: Neue Tarife' }
        ]
    },
    admin: {
        userCount: 250,
        systemHealth: 'OK',
        lastBackup: '2025-04-01 12:00',
        alerts: [
            { type: 'info', title: 'System-Update', date: '2025-04-01', message: 'Update erfolgreich installiert' },
            { type: 'warning', title: 'Speicherplatz', date: '2025-04-01', message: '85% belegt' }
        ]
    }
};

/**
 * Initialisiert das Dashboard
 */
function initializeDashboard() {
    try {
        // Hole die aktuelle Benutzerrolle
        const role = getCurrentUserRole();
        if (!role) throw new Error('Keine Benutzerrolle gefunden');

        // Lade die Daten für das Dashboard
        loadDashboardData(role);

    } catch (error) {
        console.error('Fehler beim Initialisieren des Dashboards:', error);
        showError('Das Dashboard konnte nicht geladen werden');
    }
}

/**
 * Lädt die Daten für das Dashboard
 * @param {string} role - Benutzerrolle
 */
function loadDashboardData(role) {
    try {
        // Simulierte API-Daten
        const data = dummyData[role];
        if (!data) throw new Error('Keine Daten für diese Rolle verfügbar');

        // Rendere das Dashboard
        renderDashboard(role, data);
        
    } catch (error) {
        console.error('Fehler beim Laden der Dashboard-Daten:', error);
        showError(error.message);
    }
}

/**
 * Rendert das Dashboard basierend auf der Benutzerrolle
 * @param {string} role - Benutzerrolle
 * @param {Object} data - Dashboard-Daten
 */
function renderDashboard(role, data) {
    const container = document.getElementById('dashboard-container');
    if (!container) {
        console.error('Dashboard-Container nicht gefunden');
        return;
    }

    // Rendere das entsprechende Dashboard
    switch (role) {
        case 'betreuer':
            renderBetreuerDashboard(data, container);
            break;
        case 'makler':
            renderMaklerDashboard(data, container);
            break;
        case 'admin':
            renderAdminDashboard(data, container);
            break;
        default:
            showError('Unbekannte Benutzerrolle');
    }
}

/**
 * Rendert das Betreuer-Dashboard
 * @param {Object} data - Dashboard-Daten
 * @param {HTMLElement} container - Container-Element
 */
function renderBetreuerDashboard(data, container) {
    container.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Makler</h5>
                        <p class="card-text">${data.maklerCount} aktive Makler</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Support-Tickets</h5>
                        <p class="card-text">${data.activeTickets} offene Tickets</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Schulungen</h5>
                        <p class="card-text">${data.pendingTrainings} ausstehende Schulungen</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Letzte Aktivitäten</h5>
                        <div class="list-group">
                            ${data.recentActivities.map(activity => `
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">${activity.title}</h6>
                                        <small>${activity.date}</small>
                                    </div>
                                    <p class="mb-1">${activity.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Rendert das Makler-Dashboard
 * @param {Object} data - Dashboard-Daten
 * @param {HTMLElement} container - Container-Element
 */
function renderMaklerDashboard(data, container) {
    container.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Verträge</h5>
                        <p class="card-text">${data.contracts} aktive Verträge</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Kunden</h5>
                        <p class="card-text">${data.customers} aktive Kunden</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Provisionen</h5>
                        <p class="card-text">${data.commissions}€ offene Provisionen</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Anstehende Termine</h5>
                        <div class="list-group">
                            ${data.appointments.map(appointment => `
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">${appointment.title}</h6>
                                        <small>${appointment.date}</small>
                                    </div>
                                    <p class="mb-1">${appointment.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Rendert das Admin-Dashboard
 * @param {Object} data - Dashboard-Daten
 * @param {HTMLElement} container - Container-Element
 */
function renderAdminDashboard(data, container) {
    container.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Benutzer</h5>
                        <p class="card-text">${data.userCount} aktive Benutzer</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">System-Status</h5>
                        <p class="card-text">Status: ${data.systemHealth}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Backup</h5>
                        <p class="card-text">Letztes Backup: ${data.lastBackup}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">System-Meldungen</h5>
                        <div class="list-group">
                            ${data.alerts.map(alert => `
                                <div class="list-group-item list-group-item-${alert.type}">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">${alert.title}</h6>
                                        <small>${alert.date}</small>
                                    </div>
                                    <p class="mb-1">${alert.message}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Hilfsfunktion zum Anzeigen von Fehlermeldungen
 * @param {string} message - Fehlermeldung
 */
function showError(message) {
    const container = document.getElementById('dashboard-container');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger m-3">
                <h4 class="alert-heading">Fehler</h4>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialisiere das Dashboard beim Laden der Seite
document.addEventListener('DOMContentLoaded', initializeDashboard);
