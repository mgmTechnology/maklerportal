/**
 * Dokumente Funktionalität
 */

// Demo-Daten für Dokumente
const demoDokumente = [
    {
        id: 'D001',
        name: 'Versicherungspolice.pdf',
        kunde: 'Max Mustermann',
        typ: 'PDF',
        datum: '2024-03-15',
        groesse: '1.2 MB',
        kategorie: 'Verträge'
    },
    {
        id: 'D002',
        name: 'Beratungsprotokoll.docx',
        kunde: 'Anna Müller',
        typ: 'DOCX',
        datum: '2024-03-20',
        groesse: '850 KB',
        kategorie: 'Protokolle'
    },
    {
        id: 'D003',
        name: 'Schadensmeldung.pdf',
        kunde: 'Peter Meyer',
        typ: 'PDF',
        datum: '2024-03-25',
        groesse: '2.1 MB',
        kategorie: 'Schäden'
    }
];

/**
 * Initialisiert die Dokumentenübersicht
 */
function initDokumente() {
    loadDokumente();
}

/**
 * Lädt die Dokumentendaten und zeigt sie in der Tabelle an
 */
function loadDokumente() {
    const tableBody = document.getElementById('documentsTableBody');
    if (!tableBody) return;

    // Prüfe, ob die Tabelle bereits Daten enthält
    if (tableBody.children.length > 0) return;

    demoDokumente.forEach(dokument => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <i class="bi ${getFileIcon(dokument.typ)} me-2"></i>
                ${dokument.name}
            </td>
            <td>${dokument.kunde}</td>
            <td>${dokument.kategorie}</td>
            <td>${dokument.datum}</td>
            <td>${dokument.groesse}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="downloadDocument('${dokument.id}')">
                    <i class="bi bi-download"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteDocument('${dokument.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Bestimmt das passende Icon für den Dateityp
 */
function getFileIcon(typ) {
    switch (typ.toLowerCase()) {
        case 'pdf': return 'bi-file-pdf';
        case 'docx': return 'bi-file-word';
        case 'xlsx': return 'bi-file-excel';
        case 'jpg':
        case 'png': return 'bi-file-image';
        default: return 'bi-file-text';
    }
}

/**
 * Simuliert den Download eines Dokuments
 */
function downloadDocument(id) {
    const dokument = demoDokumente.find(d => d.id === id);
    if (!dokument) return;
    alert(`Download von ${dokument.name} wird simuliert...`);
}

/**
 * Löscht ein Dokument
 */
function deleteDocument(id) {
    if (confirm('Möchten Sie dieses Dokument wirklich löschen?')) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();
    }
}

// Event Listener für Seitenladung
document.addEventListener('DOMContentLoaded', function() {
    initDokumente();
});
