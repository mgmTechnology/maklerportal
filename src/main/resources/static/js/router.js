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

        // Prüfe Login-Status
        this.checkAuth();

        // Lade Standard-Modul (Dashboard)
        this.loadModule('dashboard');
    }

    /**
     * Prüft den Authentifizierungsstatus
     */
    checkAuth() {
        const userRole = sessionStorage.getItem('userRole');
        if (!userRole) {
            window.location.href = 'login.html';
            return;
        }

        // Zeige Benutzerinformationen
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `<i class="bi bi-person-circle"></i> ${userRole}`;
    }

    /**
     * Lädt ein Modul und dessen zugehörige JavaScript-Datei
     * @param {string} moduleName - Name des zu ladenden Moduls
     */
    async loadModule(moduleName) {
        try {
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
        button.innerHTML = theme === 'dark' ? 
            '<i class="bi bi-sun"></i>' : 
            '<i class="bi bi-moon"></i>';
    }

    /**
     * Behandelt den Logout-Prozess
     */
    handleLogout() {
        sessionStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}

// Initialisiere Router wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
