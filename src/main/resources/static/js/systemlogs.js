/**
 * System Logs Funktionalität
 */

// Beispiel-Logs für die Demonstration
let dummyLogs = [
    {
        timestamp: '2024-04-01 08:30:15',
        level: 'INFO',
        user: 'admin',
        event: 'Login',
        details: 'Erfolgreicher Login von Administrator'
    },
    {
        timestamp: '2024-04-01 08:29:00',
        level: 'WARNING',
        user: 'system',
        event: 'Speicherauslastung',
        details: 'Speicherauslastung über 80%'
    },
    {
        timestamp: '2024-04-01 08:25:30',
        level: 'ERROR',
        user: 'makler1',
        event: 'Dokumentenupload',
        details: 'Fehler beim Upload: Datei zu groß'
    }
];

/**
 * Initialisiert das System-Logs Modul
 */
function initSystemLogs() {
    loadLogs();
    
    // Event-Listener für Export-Button
    document.getElementById('exportLogs')?.addEventListener('click', exportLogs);
    
    // Event-Listener für Clear-Button
    document.getElementById('clearLogs')?.addEventListener('click', clearLogs);
}

/**
 * Lädt die System-Logs in die Tabelle
 */
function loadLogs() {
    const tableBody = document.getElementById('logsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    dummyLogs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td><span class="badge bg-${getLevelColor(log.level)}">${log.level}</span></td>
            <td>${log.user}</td>
            <td>${log.event}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="showLogDetails(${JSON.stringify(log).replace(/"/g, '&quot;')})">
                    Details
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Bestimmt die Farbe für den Level-Badge
 * @param {string} level - Log-Level
 * @returns {string} Bootstrap-Farbe
 */
function getLevelColor(level) {
    switch(level.toUpperCase()) {
        case 'ERROR':
            return 'danger';
        case 'WARNING':
            return 'warning';
        case 'INFO':
            return 'info';
        default:
            return 'secondary';
    }
}

/**
 * Zeigt die Details eines Logs im Modal
 * @param {Object} log - Log-Eintrag
 */
function showLogDetails(log) {
    const modal = document.getElementById('logDetailsModal');
    if (!modal) return;

    document.getElementById('logDetailsTitle').textContent = `Log Details - ${log.event}`;
    document.getElementById('logDetailsBody').innerHTML = `
        <p><strong>Zeitstempel:</strong> ${log.timestamp}</p>
        <p><strong>Level:</strong> ${log.level}</p>
        <p><strong>Benutzer:</strong> ${log.user}</p>
        <p><strong>Event:</strong> ${log.event}</p>
        <p><strong>Details:</strong> ${log.details}</p>
    `;

    new bootstrap.Modal(modal).show();
}

/**
 * Exportiert die Logs als JSON-Datei
 */
function exportLogs() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dummyLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "system_logs.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/**
 * Leert die Logs nach Bestätigung
 */
function clearLogs() {
    if (confirm('Möchten Sie wirklich alle Logs löschen?')) {
        dummyLogs = [];
        loadLogs();
    }
}

// Initialisiere das System-Logs Modul
initSystemLogs();
