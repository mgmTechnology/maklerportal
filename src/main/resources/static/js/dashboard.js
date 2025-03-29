/**
 * Initialisiert das Dashboard-Modul
 * @function
 */
function initDashboard() {
    loadDashboardData();
    loadActivities();
}

/**
 * Lädt die Dummy-Daten für das Dashboard
 * @function
 */
function loadDashboardData() {
    // Dummy-Daten für das Dashboard
    document.getElementById('activeContracts').textContent = '247';
    document.getElementById('monthlyCommission').textContent = '12.458,00 €';
    document.getElementById('openApplications').textContent = '15';
    document.getElementById('openTickets').textContent = '3';
}

/**
 * Lädt die Dummy-Aktivitätsdaten
 * @function
 */
function loadActivities() {
    const activities = [
        {
            type: 'contract',
            icon: 'bi-file-text',
            title: 'Neuer Vertrag erstellt',
            description: 'KFZ-Versicherung für Thomas Schmidt',
            time: 'Vor 2 Stunden'
        },
        {
            type: 'commission',
            icon: 'bi-currency-euro',
            title: 'Provision eingegangen',
            description: 'Hausratversicherung Familie Müller',
            time: 'Vor 5 Stunden'
        },
        {
            type: 'document',
            icon: 'bi-file-earmark-text',
            title: 'Dokument hochgeladen',
            description: 'Schadensmeldung KFZ-Unfall',
            time: 'Vor 1 Tag'
        },
        {
            type: 'support',
            icon: 'bi-ticket',
            title: 'Support-Ticket bearbeitet',
            description: 'Anpassung Zahlungsweise',
            time: 'Vor 2 Tagen'
        }
    ];

    const activitiesList = document.getElementById('activities');
    activitiesList.innerHTML = activities.map(activity => `
        <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <i class="bi ${activity.icon} me-2"></i>
                    <strong>${activity.title}</strong>
                    <div class="text-secondary">${activity.description}</div>
                </div>
                <small class="text-secondary">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Initialisiere das Dashboard wenn das Modul geladen wird
if (typeof router !== 'undefined') {
    initDashboard();
}
