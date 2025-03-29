/**
 * Router-Klasse für die Navigation und Modul-Verwaltung
 * @class
 */
class Router {
    constructor() {
        this.currentModule = null;
        this.init();
    }

    /**
     * Initialisiert den Router und Event-Listener
     */
    init() {
        // Theme-Management
        this.initTheme();
        
        // Sidebar Toggle
        document.getElementById('sidebarCollapse').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('content').classList.toggle('active');
        });

        // Navigation Event-Listener
        document.querySelectorAll('[data-module]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.currentTarget.getAttribute('data-module');
                this.loadModule(module);
            });
        });

        // Logout Handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    /**
     * Initialisiert das Theme basierend auf localStorage
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);
    }

    /**
     * Wechselt zwischen Light und Dark Theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeButton(newTheme);
    }

    /**
     * Aktualisiert das Theme-Toggle-Button-Icon
     * @param {string} theme - Aktuelles Theme ('light' oder 'dark')
     */
    updateThemeButton(theme) {
        const button = document.getElementById('themeToggle');
        if (button) {
            button.innerHTML = `<i class="bi bi-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        }
    }

    /**
     * Behandelt den Logout-Prozess
     */
    handleLogout() {
        sessionStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }

    /**
     * Zeigt das entsprechende Menü basierend auf der Benutzerrolle an
     * @function
     */
    showRoleMenu() {
        const role = sessionStorage.getItem('userRole');
        const maklerMenu = document.getElementById('maklerMenu');
        const betreuerMenu = document.getElementById('betreuerMenu');
        
        if (!role) {
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Aktuelle Rolle:', role); // Debug-Ausgabe
        
        if (role === 'makler') {
            console.log('Zeige Makler-Menü'); // Debug-Ausgabe
            maklerMenu.style.display = 'block';
            betreuerMenu.style.display = 'none';
        } else if (role === 'betreuer') {
            console.log('Zeige Betreuer-Menü'); // Debug-Ausgabe
            maklerMenu.style.display = 'none';
            betreuerMenu.style.display = 'block';
        }
    }

    /**
     * Setzt die Benutzerrolle für Testzwecke
     * @param {string} role - Die zu setzende Rolle ('makler' oder 'betreuer')
     */
    setUserRole(role) {
        if (role === 'makler' || role === 'betreuer') {
            console.log('Setze Rolle auf:', role); // Debug-Ausgabe
            sessionStorage.setItem('userRole', role);
            this.showRoleMenu();
            // Lade das Dashboard als Standardmodul
            this.loadModule('dashboard');
        }
    }

    /**
     * Lädt ein Modul und dessen zugehörige JavaScript-Datei
     * @param {string} moduleName - Name des zu ladenden Moduls
     */
    async loadModule(moduleName) {
        try {
            console.log('Lade Modul:', moduleName); // Debug-Ausgabe
            
            // Lade HTML-Content
            const response = await fetch(`modules/${moduleName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            
            // Setze Content
            document.getElementById('main-content').innerHTML = content;

            // Lade und führe Modul-spezifisches JavaScript aus
            const script = document.createElement('script');
            script.src = `js/${moduleName}.js`;
            script.onload = () => {
                // Initialisiere Modul
                if (window[`init${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`]) {
                    window[`init${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`]();
                }
            };
            document.body.appendChild(script);

            // Aktualisiere aktiven Navigation-Link
            document.querySelectorAll('[data-module]').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-module') === moduleName) {
                    link.classList.add('active');
                }
            });

            this.currentModule = moduleName;
        } catch (error) {
            console.error('Fehler beim Laden des Moduls:', error);
            document.getElementById('main-content').innerHTML = '<div class="alert alert-danger">Fehler beim Laden des Moduls</div>';
        }
    }
}

// Erstelle eine globale Router-Instanz
let router;

// Event Listener für das Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM geladen'); // Debug-Ausgabe
    router = new Router();
    
    // Setze für Testzwecke die Rolle auf 'betreuer'
    router.setUserRole('betreuer');
});
