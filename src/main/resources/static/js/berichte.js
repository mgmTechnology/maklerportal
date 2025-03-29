/**
 * Initialisiert die Berichte-Seite
 */
function initBerichte() {
    console.log('Initialisiere Berichte...');
    loadStatistics();
    loadTopPerformers();
    loadKPIs();
    initializeCharts();
}

/**
 * Lädt die Statistiken
 * @function
 */
function loadStatistics() {
    document.getElementById('activeBrokers').textContent = '42';
    document.getElementById('avgContracts').textContent = '8,5';
    document.getElementById('avgCommission').textContent = '1.850 €';
    document.getElementById('cancellationRate').textContent = '3,2%';
}

/**
 * Lädt die Top Performer
 * @function
 */
function loadTopPerformers() {
    // Realistische Dummy-Daten für Top Performer
    const performers = [
        {
            name: 'Thomas Schmidt',
            contracts: 28,
            commission: '52.450 €',
            trend: 'up'
        },
        {
            name: 'Maria Weber',
            contracts: 25,
            commission: '48.320 €',
            trend: 'up'
        },
        {
            name: 'Stefan Meyer',
            contracts: 22,
            commission: '42.180 €',
            trend: 'down'
        },
        {
            name: 'Laura Müller',
            contracts: 21,
            commission: '40.950 €',
            trend: 'up'
        },
        {
            name: 'Michael Wagner',
            contracts: 19,
            commission: '37.840 €',
            trend: 'stable'
        }
    ];

    const tableBody = document.getElementById('topPerformersTable');
    tableBody.innerHTML = performers.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.contracts}</td>
            <td>${p.commission}</td>
            <td>
                <i class="bi bi-arrow-${p.trend} text-${getTrendColor(p.trend)}"></i>
            </td>
        </tr>
    `).join('');
}

/**
 * Lädt die KPIs
 * @function
 */
function loadKPIs() {
    // Realistische Dummy-Daten für KPIs
    const kpis = [
        {
            name: 'Vertragsabschlüsse',
            current: '358',
            previous: '325',
            change: '+10,2%',
            status: 'success'
        },
        {
            name: 'Durchschnittliche Provision',
            current: '1.850 €',
            previous: '1.780 €',
            change: '+3,9%',
            status: 'success'
        },
        {
            name: 'Stornoquote',
            current: '3,2%',
            previous: '3,5%',
            change: '-8,6%',
            status: 'success'
        },
        {
            name: 'Bearbeitungszeit (Ø)',
            current: '2,8 Tage',
            previous: '3,2 Tage',
            change: '-12,5%',
            status: 'success'
        },
        {
            name: 'Kundenzufriedenheit',
            current: '4,6/5,0',
            previous: '4,4/5,0',
            change: '+4,5%',
            status: 'success'
        },
        {
            name: 'Cross-Selling-Quote',
            current: '28,5%',
            previous: '25,8%',
            change: '+10,5%',
            status: 'success'
        },
        {
            name: 'Neukundenquote',
            current: '15,8%',
            previous: '14,2%',
            change: '+11,3%',
            status: 'success'
        }
    ];

    const tableBody = document.getElementById('kpiTable');
    tableBody.innerHTML = kpis.map(kpi => `
        <tr>
            <td>${kpi.name}</td>
            <td>${kpi.current}</td>
            <td>${kpi.previous}</td>
            <td><span class="text-${kpi.status}">${kpi.change}</span></td>
            <td>
                <span class="badge bg-${kpi.status}">
                    <i class="bi bi-check-circle"></i>
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * Initialisiert die Charts
 * @function
 */
function initializeCharts() {
    // Vertragsentwicklung Chart
    const contractsCtx = document.getElementById('contractsChart').getContext('2d');
    new Chart(contractsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Verträge 2024',
                    data: [125, 138, 142, 148, 152, 158, 162, 168, 172, 178, 182, 185],
                    borderColor: '#2c7be5',
                    tension: 0.4
                },
                {
                    label: 'Verträge 2023',
                    data: [115, 122, 128, 132, 138, 142, 145, 150, 154, 158, 162, 165],
                    borderColor: '#d8e2ef',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Produktverteilung Chart
    const productCtx = document.getElementById('productDistributionChart').getContext('2d');
    new Chart(productCtx, {
        type: 'doughnut',
        data: {
            labels: ['Leben', 'KFZ', 'Sach', 'Kranken', 'Sonstige'],
            datasets: [{
                data: [35, 28, 20, 12, 5],
                backgroundColor: [
                    '#2c7be5',
                    '#00d97e',
                    '#6b5eae',
                    '#e63757',
                    '#39afd1'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Regionale Verteilung Chart
    const regionalCtx = document.getElementById('regionalDistributionChart').getContext('2d');
    new Chart(regionalCtx, {
        type: 'bar',
        data: {
            labels: ['Nord', 'Süd', 'West', 'Ost'],
            datasets: [
                {
                    label: 'Verträge',
                    data: [485, 520, 465, 380],
                    backgroundColor: '#2c7be5'
                },
                {
                    label: 'Makler',
                    data: [12, 15, 10, 8],
                    backgroundColor: '#00d97e'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Forecast Charts
    initializeForecastCharts();
}

/**
 * Initialisiert die Forecast-Charts
 * @function
 */
function initializeForecastCharts() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Vertragsabschlüsse Forecast
    const contractsForecastCtx = document.getElementById('contractsForecastChart').getContext('2d');
    new Chart(contractsForecastCtx, {
        type: 'line',
        data: {
            labels: ['Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Forecast',
                data: [185, 192, 198, 205, 212, 220],
                borderColor: '#2c7be5',
                backgroundColor: 'rgba(44, 123, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: options
    });

    // Provisionen Forecast
    const commissionsForecastCtx = document.getElementById('commissionsForecastChart').getContext('2d');
    new Chart(commissionsForecastCtx, {
        type: 'line',
        data: {
            labels: ['Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Forecast',
                data: [342500, 355000, 368000, 382000, 395000, 410000],
                borderColor: '#00d97e',
                backgroundColor: 'rgba(0, 217, 126, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...options,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => (value / 1000).toFixed(0) + ' T€'
                    }
                }
            }
        }
    });

    // Maklerentwicklung Forecast
    const brokersForecastCtx = document.getElementById('brokersForecastChart').getContext('2d');
    new Chart(brokersForecastCtx, {
        type: 'line',
        data: {
            labels: ['Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Forecast',
                data: [42, 44, 45, 47, 48, 50],
                borderColor: '#6b5eae',
                backgroundColor: 'rgba(107, 94, 174, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: options
    });
}

/**
 * Hilfsfunktion für die Trendfarben
 * @param {string} trend - Der Trend (up, down, stable)
 * @returns {string} Die entsprechende Bootstrap-Farbe
 */
function getTrendColor(trend) {
    switch(trend) {
        case 'up': return 'success';
        case 'down': return 'danger';
        case 'stable': return 'warning';
        default: return 'secondary';
    }
}

// Initialisiere die Berichte wenn sie geladen werden
if (typeof router !== 'undefined') {
    initBerichte();
}
