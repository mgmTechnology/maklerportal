/**
 * Berichte Funktionalität
 */

// Demo-Daten für Berichte
const demoVertriebszahlen = {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
    datasets: [{
        label: 'Neugeschäft (€)',
        data: [12500, 15000, 18000, 16500, 21000, 19500],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

const demoProduktverteilung = {
    labels: ['Lebensversicherung', 'KFZ-Versicherung', 'Hausrat', 'Haftpflicht', 'Unfall'],
    datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)'
        ]
    }]
};

const demoProvisionsUebersicht = {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
    datasets: [{
        label: 'Ausgezahlt',
        data: [5000, 6200, 7400, 6800, 8500, 7900],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
    }, {
        label: 'Ausstehend',
        data: [2000, 1800, 2500, 2200, 3000, 2700],
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        borderColor: 'rgb(255, 205, 86)',
        borderWidth: 1
    }]
};

/**
 * Initialisiert die Berichte
 */
function initBerichte() {
    initVertriebszahlen();
    initProduktverteilung();
    initProvisionsUebersicht();
}

/**
 * Initialisiert das Vertriebszahlen-Chart
 */
function initVertriebszahlen() {
    const ctx = document.getElementById('vertriebszahlenChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: demoVertriebszahlen,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Vertriebszahlen - Neugeschäft'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialisiert das Produktverteilung-Chart
 */
function initProduktverteilung() {
    const ctx = document.getElementById('produktverteilungChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: demoProduktverteilung,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Verteilung nach Produkten'
                }
            }
        }
    });
}

/**
 * Initialisiert das Provisionsübersicht-Chart
 */
function initProvisionsUebersicht() {
    const ctx = document.getElementById('provisionsUebersichtChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: demoProvisionsUebersicht,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Provisionsübersicht'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
                        }
                    }
                }
            }
        }
    });
}

// Event Listener für Seitenladung
document.addEventListener('DOMContentLoaded', function() {
    initBerichte();
});
