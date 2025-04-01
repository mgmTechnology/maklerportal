/**
 * Initialisiert die Kalenderansicht
 */
document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.getElementById('calendarBody');
    const currentMonthBtn = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let currentDate = new Date();
    
    // Event-Listener für Monatsnavigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    /**
     * Rendert den Kalender für den aktuellen Monat
     */
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Aktualisiere Monatsanzeige
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                          'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        currentMonthBtn.textContent = `${monthNames[month]} ${year}`;
        
        // Leere den Kalender
        calendarBody.innerHTML = '';
        
        // Ermittle den ersten Tag des Monats
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay() || 7; // Konvertiere 0 (Sonntag) zu 7
        
        // Ermittle die Anzahl der Tage im Monat
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        
        let date = 1;
        let html = '';
        
        // Erstelle die Kalenderwochen
        for (let i = 0; date <= totalDays; i++) {
            html += '<tr>';
            
            // Erstelle die Tage in der Woche
            for (let j = 1; j <= 7; j++) {
                if (i === 0 && j < startingDay) {
                    html += '<td></td>';
                } else if (date > totalDays) {
                    html += '<td></td>';
                } else {
                    const isWeekend = j > 5;
                    const isToday = date === new Date().getDate() && 
                                  month === new Date().getMonth() && 
                                  year === new Date().getFullYear();
                    
                    html += `
                        <td class="${isWeekend ? 'table-light' : ''} ${isToday ? 'table-primary' : ''}" style="height: 100px; vertical-align: top;">
                            <div class="d-flex justify-content-between">
                                <span>${date}</span>
                                <button class="btn btn-sm btn-link p-0" onclick="addTermin(${year}, ${month}, ${date})">
                                    <i class="bi bi-plus-circle"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    date++;
                }
            }
            
            html += '</tr>';
        }
        
        calendarBody.innerHTML = html;
    }
    
    // Initial rendern
    renderCalendar();
});

/**
 * Termine Funktionalität
 */

// Demo-Daten für Termine
const demoTermine = [
    {
        id: 'T001',
        datum: '2024-04-02',
        uhrzeit: '10:00',
        titel: 'Kundengespräch',
        kunde: 'Max Mustermann',
        ort: 'Büro',
        status: 'Anstehend',
        notizen: 'Besprechung Altersvorsorge'
    },
    {
        id: 'T002',
        datum: '2024-04-03',
        uhrzeit: '14:30',
        titel: 'Vertragsabschluss',
        kunde: 'Anna Müller',
        ort: 'Kunde vor Ort',
        status: 'Bestätigt',
        notizen: 'KFZ-Versicherung'
    },
    {
        id: 'T003',
        datum: '2024-04-05',
        uhrzeit: '11:00',
        titel: 'Beratung',
        kunde: 'Peter Meyer',
        ort: 'Online',
        status: 'Anfrage',
        notizen: 'Hausratversicherung'
    }
];

/**
 * Initialisiert die Terminübersicht
 */
function initTermine() {
    loadTermine();
    loadAlleTermine();
}

/**
 * Lädt die anstehenden Termine
 */
function loadTermine() {
    const tableBody = document.getElementById('termineTableBody');
    if (!tableBody) return;

    // Prüfe, ob die Tabelle bereits Daten enthält
    if (tableBody.children.length > 0) return;

    // Sortiere Termine nach Datum
    const sortedTermine = [...demoTermine].sort((a, b) => 
        new Date(a.datum + ' ' + a.uhrzeit) - new Date(b.datum + ' ' + b.uhrzeit)
    );

    sortedTermine.forEach(termin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${termin.datum}<br>${termin.uhrzeit}</td>
            <td>${termin.titel}</td>
            <td><span class="badge bg-${getStatusBadgeClass(termin.status)}">${termin.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Lädt alle Termine in die Haupttabelle
 */
function loadAlleTermine() {
    const tableBody = document.getElementById('alleTermineTableBody');
    if (!tableBody) return;

    // Prüfe, ob die Tabelle bereits Daten enthält
    if (tableBody.children.length > 0) return;

    demoTermine.forEach(termin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${termin.datum}<br>${termin.uhrzeit}</td>
            <td>${termin.titel}</td>
            <td>${termin.kunde}</td>
            <td>${termin.ort}</td>
            <td><span class="badge bg-${getStatusBadgeClass(termin.status)}">${termin.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showTerminDetails('${termin.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTermin('${termin.id}')">
                    <i class="bi bi-trash"></i>
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
        case 'Anstehend': return 'primary';
        case 'Bestätigt': return 'success';
        case 'Anfrage': return 'warning';
        case 'Abgesagt': return 'danger';
        default: return 'secondary';
    }
}

/**
 * Öffnet das Modal für einen neuen Termin
 */
function openNewTerminModal() {
    // TODO: Implementiere das Modal für neue Termine
    alert('Funktion zum Erstellen neuer Termine wird noch implementiert');
}

/**
 * Zeigt die Details eines Termins an
 */
function showTerminDetails(id) {
    const termin = demoTermine.find(t => t.id === id);
    if (!termin) return;

    // TODO: Implementiere die Detailansicht
    alert(`Details für Termin ${termin.titel} werden noch implementiert`);
}

/**
 * Löscht einen Termin
 */
function deleteTermin(id) {
    if (confirm('Möchten Sie diesen Termin wirklich löschen?')) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();
    }
}

/**
 * Öffnet den Dialog für einen neuen Termin
 * @param {number} year - Das Jahr
 * @param {number} month - Der Monat (0-11)
 * @param {number} day - Der Tag
 */
function addTermin(year, month, day) {
    const date = new Date(year, month, day);
    const formattedDate = date.toLocaleDateString('de-DE');
    alert(`Neuer Termin für ${formattedDate}`);
    // Hier könnte ein Modal oder Formular geöffnet werden
}

// Event Listener für Seitenladung
document.addEventListener('DOMContentLoaded', function() {
    initTermine();
});
