/**
 * Initialisiert die System-Logs Ansicht
 */
document.addEventListener('DOMContentLoaded', function() {
    const logLevel = document.getElementById('logLevel');
    const logComponent = document.getElementById('logComponent');
    const searchInput = document.getElementById('searchLogs');
    const refreshBtn = document.getElementById('refreshLogs');

    // Event-Listener für Filter
    logLevel.addEventListener('change', filterLogs);
    logComponent.addEventListener('change', filterLogs);
    searchInput.addEventListener('input', filterLogs);
    refreshBtn.addEventListener('click', refreshLogs);

    /**
     * Filtert die Logs basierend auf den ausgewählten Kriterien
     */
    function filterLogs() {
        const level = logLevel.value;
        const component = logComponent.value;
        const searchText = searchInput.value.toLowerCase();

        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowLevel = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const rowComponent = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const rowText = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

            const levelMatch = level === 'all' || rowLevel.includes(level);
            const componentMatch = component === 'all' || rowComponent === component;
            const textMatch = searchText === '' || rowText.includes(searchText);

            row.style.display = levelMatch && componentMatch && textMatch ? '' : 'none';
        });
    }

    /**
     * Aktualisiert die Log-Ansicht
     */
    function refreshLogs() {
        const refreshIcon = refreshBtn.querySelector('i');
        refreshIcon.classList.add('bi-arrow-clockwise-spinning');
        
        // Simuliere Aktualisierung
        setTimeout(() => {
            refreshIcon.classList.remove('bi-arrow-clockwise-spinning');
            // Hier würden in einer echten Anwendung neue Logs geladen
        }, 1000);
    }
});
