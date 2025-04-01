/**
 * Initialisiert das Provisionen-Modul
 * @function
 */
function initProvisionen() {
    loadSummary();
    loadCommissions();
    initializeEventListeners();
    loadProvisionsTable();
    loadProvisionsSummary();
}

/**
 * Lädt die Zusammenfassungsdaten
 * @function
 */
function loadSummary() {
    // Dummy-Daten für die Übersichtskarten
    document.getElementById('mtdCommission').textContent = '4.582,40 €';
    document.getElementById('ytdCommission').textContent = '38.947,65 €';
    document.getElementById('pendingCommission').textContent = '2.845,00 €';
    document.getElementById('cancelationReserve').textContent = '5.420,80 €';
}

/**
 * Lädt die Dummy-Provisionsdaten
 * @function
 */
function loadCommissions() {
    const commissions = [
        {
            date: '15.03.2024',
            contractNumber: 'VS-2024-001',
            customer: 'Thomas Schmidt',
            type: 'KFZ-Versicherung',
            yearlyFee: '1.074,00 €',
            commission: '107,40 €',
            status: 'paid',
            id: 'com1'
        },
        {
            date: '01.03.2024',
            contractNumber: 'VS-2024-002',
            customer: 'Maria Müller',
            type: 'Hausratversicherung',
            yearlyFee: '248,40 €',
            commission: '24,84 €',
            status: 'pending',
            id: 'com2'
        },
        {
            date: '01.02.2024',
            contractNumber: 'VS-2024-003',
            customer: 'Peter Wagner',
            type: 'Lebensversicherung',
            yearlyFee: '1.840,00 €',
            commission: '460,00 €',
            status: 'paid',
            id: 'com3'
        }
    ];

    const tableBody = document.getElementById('commissionsTableBody');
    tableBody.innerHTML = commissions.map(commission => `
        <tr>
            <td>${commission.date}</td>
            <td>${commission.contractNumber}</td>
            <td>${commission.customer}</td>
            <td>${commission.type}</td>
            <td>${commission.yearlyFee}</td>
            <td>${commission.commission}</td>
            <td><span class="badge bg-${getStatusBadgeClass(commission.status)}">${getStatusText(commission.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewCommissionDetails('${commission.id}')">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Initialisiert die Event-Listener für Filter und Suche
 * @function
 */
function initializeEventListeners() {
    // Zeitraumfilter
    document.getElementById('timePeriod').addEventListener('change', filterCommissions);
    
    // Statusfilter
    document.getElementById('commissionStatus').addEventListener('change', filterCommissions);
    
    // Versicherungsartfilter
    document.getElementById('insuranceType').addEventListener('change', filterCommissions);
    
    // Suche
    document.getElementById('searchCommissions').addEventListener('input', filterCommissions);
}

/**
 * Filtert die Provisionen basierend auf den ausgewählten Kriterien
 * @function
 */
function filterCommissions() {
    // Implementierung der Filter-Logik hier
    console.log('Filtering commissions...');
}

/**
 * Gibt die CSS-Klasse für den Status-Badge zurück
 * @param {string} status - Der Status der Provision
 * @returns {string} Die CSS-Klasse für den Badge
 */
function getStatusBadgeClass(status) {
    switch(status) {
        case 'paid': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

/**
 * Gibt den deutschen Text für den Status zurück
 * @param {string} status - Der Status der Provision
 * @returns {string} Der übersetzte Status-Text
 */
function getStatusText(status) {
    switch(status) {
        case 'paid': return 'Ausgezahlt';
        case 'pending': return 'Ausstehend';
        case 'cancelled': return 'Storniert';
        default: return status;
    }
}

/**
 * Zeigt die Details einer Provision an
 * @param {string} commissionId - Die ID der Provision
 */
function viewCommissionDetails(commissionId) {
    // Dummy-Daten für die Detailansicht
    const details = {
        contractNumber: 'VS-2024-001',
        customer: 'Thomas Schmidt',
        type: 'KFZ-Versicherung',
        date: '15.03.2024',
        yearlyFee: '1.074,00 €',
        commission: '107,40 €',
        status: 'Ausgezahlt',
        paymentDate: '20.03.2024',
        bankAccount: 'DE89 3704 0044 0532 0130 00',
        notes: 'Erstprovision'
    };

    const detailsContainer = document.getElementById('commissionDetails');
    detailsContainer.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label fw-bold">Vertragsnummer</label>
                <p>${details.contractNumber}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Kunde</label>
                <p>${details.customer}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Versicherungsart</label>
                <p>${details.type}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Datum</label>
                <p>${details.date}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Jahresbeitrag</label>
                <p>${details.yearlyFee}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Provision</label>
                <p>${details.commission}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Status</label>
                <p>${details.status}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-bold">Auszahlungsdatum</label>
                <p>${details.paymentDate}</p>
            </div>
            <div class="col-md-12">
                <label class="form-label fw-bold">Bankverbindung</label>
                <p>${details.bankAccount}</p>
            </div>
            <div class="col-md-12">
                <label class="form-label fw-bold">Anmerkungen</label>
                <p>${details.notes}</p>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('commissionDetailsModal'));
    modal.show();
}

/**
 * Exportiert die Provisionsdetails
 * @function
 */
function exportCommissionDetails() {
    console.log('Exporting commission details...');
    // Hier würde die Export-Logik implementiert
}

/**
 * Provisionen Funktionalität
 */

// Demo-Daten für Provisionen
const demoProvisionen = [
    { 
        id: 'P001', 
        datum: '2024-03-15', 
        vertragsnummer: 'LV-2024-001',
        kunde: 'Max Mustermann',
        versicherungsart: 'Lebensversicherung',
        jahresbeitrag: 1200.00,
        provision: 2500.00,
        status: 'Ausgezahlt'
    },
    { 
        id: 'P002', 
        datum: '2024-03-20',
        vertragsnummer: 'KFZ-2024-002',
        kunde: 'Anna Schmidt',
        versicherungsart: 'KFZ-Versicherung',
        jahresbeitrag: 960.00,
        provision: 750.00,
        status: 'In Bearbeitung'
    },
    { 
        id: 'P003', 
        datum: '2024-03-25',
        vertragsnummer: 'HR-2024-003',
        kunde: 'Peter Meyer',
        versicherungsart: 'Hausratversicherung',
        jahresbeitrag: 240.00,
        provision: 450.00,
        status: 'Ausstehend'
    }
];

/**
 * Lädt die Zusammenfassung der Provisionen
 */
function loadProvisionsSummary() {
    // MTD (Month to Date) Provisionen
    const mtdProvisionen = demoProvisionen
        .filter(p => new Date(p.datum).getMonth() === new Date().getMonth())
        .reduce((sum, p) => sum + p.provision, 0);
    
    // YTD (Year to Date) Provisionen
    const ytdProvisionen = demoProvisionen
        .filter(p => new Date(p.datum).getFullYear() === new Date().getFullYear())
        .reduce((sum, p) => sum + p.provision, 0);
    
    // Offene Provisionen
    const offeneProvisionen = demoProvisionen
        .filter(p => p.status !== 'Ausgezahlt')
        .reduce((sum, p) => sum + p.provision, 0);

    // Aktualisiere die Anzeige
    document.getElementById('mtdCommission').textContent = 
        mtdProvisionen.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    document.getElementById('ytdCommission').textContent = 
        ytdProvisionen.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    document.getElementById('pendingCommission').textContent = 
        offeneProvisionen.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

/**
 * Lädt die Provisionsdaten und zeigt sie in der Tabelle an
 */
function loadProvisionsTable() {
    const tableBody = document.getElementById('commissionsTableBody');
    if (!tableBody) return;

    // Prüfe, ob die Tabelle bereits Daten enthält
    if (tableBody.children.length > 0) return;

    demoProvisionen.forEach(provision => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provision.datum}</td>
            <td>${provision.vertragsnummer}</td>
            <td>${provision.kunde}</td>
            <td>${provision.versicherungsart}</td>
            <td>${provision.jahresbeitrag.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
            <td>${provision.provision.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
            <td><span class="badge bg-${getStatusBadgeClass(provision.status)}">${provision.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showProvisionDetails('${provision.id}')">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Bestimmt die CSS-Klasse für den Status-Badge
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Ausgezahlt': return 'success';
        case 'In Bearbeitung': return 'warning';
        case 'Ausstehend': return 'secondary';
        default: return 'primary';
    }
}

/**
 * Zeigt die Details einer Provision an
 */
function showProvisionDetails(id) {
    const provision = demoProvisionen.find(p => p.id === id);
    if (!provision) return;

    const detailsContainer = document.getElementById('commissionDetails');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Vertragsnummer:</strong> ${provision.vertragsnummer}</p>
                <p><strong>Kunde:</strong> ${provision.kunde}</p>
                <p><strong>Versicherungsart:</strong> ${provision.versicherungsart}</p>
                <p><strong>Datum:</strong> ${provision.datum}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Jahresbeitrag:</strong> ${provision.jahresbeitrag.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Provision:</strong> ${provision.provision.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Status:</strong> <span class="badge bg-${getStatusBadgeClass(provision.status)}">${provision.status}</span></p>
            </div>
        </div>
    `;

    // Modal öffnen
    const modal = new bootstrap.Modal(document.getElementById('commissionDetailsModal'));
    modal.show();
}

// Event Listener für Seitenladung
document.addEventListener('DOMContentLoaded', function() {
    loadProvisionsTable();
    loadProvisionsSummary();
});

// Initialisiere das Provisionen-Modul wenn es geladen wird
if (typeof router !== 'undefined') {
    initProvisionen();
}
