/**
 * Router-Klasse für die Navigation und Modul-Verwaltung
 */
class Router {
    constructor() {
        this.initializeRouter();
        this.loadUserInfo();
    }

    initializeRouter() {
        // Event-Listener für Menü-Links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[data-module]');
            if (target) {
                e.preventDefault();
                const module = target.getAttribute('data-module');
                const role = localStorage.getItem('role');
                this.loadModuleForRole(module, role);
            }
        });

        // Logout-Handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace('login.html');
            });
        }

        // Theme-Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('bi-moon');
                    icon.classList.toggle('bi-sun');
                }
            });
        }

        // Sidebar-Toggle
        const sidebarCollapse = document.getElementById('sidebarCollapse');
        if (sidebarCollapse) {
            sidebarCollapse.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
        }

        // Initial-Modul laden
        const role = localStorage.getItem('role');
        if (role) {
            this.loadModuleForRole('dashboard', role);
        }
    }

    loadUserInfo() {
        const role = localStorage.getItem('role');
        console.log('Lade Benutzerinfo für Rolle:', role);
        
        if (!role) {
            console.error('Keine Rolle gefunden');
            return;
        }

        // Demo-Benutzerprofile
        const userProfiles = {
            'Administrator': {
                name: 'Arnie Amsel',
                role: 'Administrator',
                avatar: 'images/admin.png'
            },
            'Betreuer': {
                name: 'Bert Banane',
                role: 'Betreuer',
                avatar: 'images/betreuer.png'
            },
            'Makler': {
                name: 'Manfred Meineid',
                role: 'Makler',
                avatar: 'images/makler.png'
            }
        };

        const profile = userProfiles[role];
        if (profile) {
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${profile.avatar}" alt="${profile.name}" class="rounded-circle me-2" width="32" height="32">
                        <div>
                            <div class="fw-bold">${profile.name}</div>
                            <small class="text-muted">${profile.role}</small>
                        </div>
                    </div>
                `;
            }
        }

        this.showMenuForRole(role);
    }

    showMenuForRole(role) {
        console.log('Setze Menü für Rolle:', role);
        
        // Alle Menüs ausblenden
        document.getElementById('adminMenu')?.style.setProperty('display', 'none');
        document.getElementById('betreuerMenu')?.style.setProperty('display', 'none');
        document.getElementById('maklerMenu')?.style.setProperty('display', 'none');

        // Korrektes Menü anzeigen
        switch(role) {
            case 'Administrator':
                document.getElementById('adminMenu')?.style.setProperty('display', 'block');
                break;
            case 'Betreuer':
                document.getElementById('betreuerMenu')?.style.setProperty('display', 'block');
                break;
            case 'Makler':
                document.getElementById('maklerMenu')?.style.setProperty('display', 'block');
                break;
        }
    }

    loadModuleForRole(moduleName, role) {
        console.log('Lade Dashboard für Rolle:', role, 'mit Prefix:', role.toLowerCase());
        
        // Mapping der Modul-Namen zu den tatsächlichen Dateinamen
        const moduleMapping = {
            'contracts': 'vertrage',
            'commission': 'provisionen',
            'users': 'makleruebersicht',
            'system': 'einstellungen',
            'reports': 'berichte',
            'logs': 'system-logs',
            'makler': 'makleruebersicht',
            'tickets': 'supportanfragen',
            'training': 'schulungen',
            'calendar': 'termine'
        };

        // Wenn es ein Mapping gibt, verwende den gemappten Namen
        const mappedModuleName = moduleMapping[moduleName] || moduleName;
        
        // Wenn es das Dashboard ist, füge den Rollen-Prefix hinzu
        if (moduleName === 'dashboard') {
            this.loadModule(mappedModuleName, role.toLowerCase());
        } else {
            // Für andere Module verwende den gemappten Namen ohne Prefix
            this.loadModule(mappedModuleName);
        }
    }

    async loadModule(moduleName, rolePrefix = '') {
        const modulePathPrefix = rolePrefix ? `${rolePrefix}-` : '';
        const modulePath = `modules/${modulePathPrefix}${moduleName}.html`;
        
        console.log('Lade Modul:', modulePath);
        
        try {
            const response = await fetch(modulePath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;

                // Entferne alte Script-Tags
                const oldScripts = document.querySelectorAll(`script[data-module="${modulePathPrefix}${moduleName}"]`);
                oldScripts.forEach(script => script.remove());

                // JavaScript-Datei laden
                const scriptPath = `js/${modulePathPrefix}${moduleName}.js`;
                console.log('Lade Script:', scriptPath);
                
                const script = document.createElement('script');
                script.src = scriptPath;
                script.setAttribute('data-module', `${modulePathPrefix}${moduleName}`);
                document.body.appendChild(script);
            }
        } catch (error) {
            console.error('Fehler beim Laden des Moduls:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-danger">
                        <h4 class="alert-heading">Fehler beim Laden des Moduls</h4>
                        <p>Das Modul "${modulePath}" konnte nicht geladen werden.</p>
                        <hr>
                        <p class="mb-0">Fehlermeldung: ${error.message}</p>
                    </div>`;
            }
        }
    }
}

// Router initialisieren
window.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
