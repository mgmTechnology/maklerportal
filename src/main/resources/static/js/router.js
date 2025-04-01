/**
 * Router-Klasse für die Navigation und Modul-Verwaltung
 */
class Router {
    constructor() {
        this.moduleCache = new Map(); // Cache für geladene Module
        this.currentRole = null;
        this.chartInstances = new Map(); // Speichert Chart-Instanzen
        this.activeCharts = new Set(); // Speichert aktive Chart-Instanzen
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
                this.loadModuleForRole(module, this.currentRole);
            }
        });

        // Logout-Handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                try {
                    const username = localStorage.getItem('username');
                    localStorage.clear();
                    sessionStorage.clear();
                    this.moduleCache.clear();
                    console.log('Benutzer', username, 'erfolgreich abgemeldet');
                    window.location.replace('login.html');
                } catch (error) {
                    console.error('Fehler beim Logout:', error);
                    alert('Fehler beim Abmelden. Bitte versuchen Sie es erneut.');
                }
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
            this.currentRole = role;
            this.showMenuForRole(role);
            this.loadModuleForRole('dashboard', role);
        }
    }

    loadUserInfo() {
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        console.log('Lade Benutzerinfo für:', username, 'Rolle:', role);
        
        if (!role || !username) {
            console.error('Keine Benutzerinformationen gefunden');
            return;
        }

        this.currentRole = role;

        // Demo-Benutzerprofile
        const userProfiles = {
            'admin': {
                name: 'Arnie Amsel',
                role: 'Administrator',
                avatar: 'images/admin.png'
            },
            'betreuer': {
                name: 'Bert Banane',
                role: 'Betreuer',
                avatar: 'images/betreuer.png'
            },
            'makler': {
                name: 'Manfred Meineid',
                role: 'Makler',
                avatar: 'images/makler.png'
            }
        };

        const profile = userProfiles[username];
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
        document.querySelectorAll('[id$="Menu"]').forEach(menu => {
            menu.style.display = 'none';
        });

        // Korrektes Menü anzeigen basierend auf der Rolle
        let menuId;
        switch(role.toLowerCase()) {
            case 'administrator':
            case 'admin':
                menuId = 'adminMenu';
                break;
            case 'betreuer':
                menuId = 'betreuerMenu';
                break;
            case 'makler':
                menuId = 'maklerMenu';
                break;
            default:
                console.error('Unbekannte Rolle:', role);
                return;
        }

        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = 'block';
        } else {
            console.error('Menü nicht gefunden:', menuId);
        }
    }

    loadModuleForRole(moduleName, role) {
        console.log('Lade Modul:', moduleName, 'für Rolle:', role);
        
        // Mapping der data-module Attribute zu den tatsächlichen Dateinamen
        const moduleMapping = {
            // Dashboards (mit Rollenprefix)
            'dashboard': {file: 'dashboard', needsPrefix: true},
            
            // Hauptmodule (Englisch -> Deutsch)
            'contracts': {file: 'vertrage', needsPrefix: false},
            'customers': {file: 'customers', needsPrefix: false},
            'commission': {file: 'provisionen', needsPrefix: false},
            'calendar': {file: 'termine', needsPrefix: false},
            'documents': {file: 'documents', needsPrefix: false},
            'reports': {file: 'berichte', needsPrefix: false},
            
            // Admin Module
            'users': {file: 'makleruebersicht', needsPrefix: false},
            'system': {file: 'einstellungen', needsPrefix: false},
            'logs': {file: 'system-logs', needsPrefix: false},
            'systemlogs': {file: 'system-logs', needsPrefix: false},
            'system-logs': {file: 'system-logs', needsPrefix: false},
            
            // Betreuer Module
            'tickets': {file: 'supportanfragen', needsPrefix: false},
            'training': {file: 'schulungen', needsPrefix: false},
            'support': {file: 'support', needsPrefix: false},
            'makler': {file: 'makleruebersicht', needsPrefix: false},  // Für Betreuer-Zugriff
            'brokers': {file: 'makleruebersicht', needsPrefix: false}, // Alternative für Betreuer
            
            // Zusätzliche Module
            'calculator': {file: 'angebotsrechner', needsPrefix: false},
            'communication': {file: 'kommunikation', needsPrefix: false},
            'performance': {file: 'leistungsuebersicht', needsPrefix: false},
            'documentation': {file: 'dokumentenverwaltung', needsPrefix: false},
            
            // Legacy-Support für direkte deutsche Dateinamen
            'vertrage': {file: 'vertrage', needsPrefix: false},
            'kunden': {file: 'customers', needsPrefix: false},
            'provisionen': {file: 'provisionen', needsPrefix: false},
            'provisionsuebersicht': {file: 'provisionsuebersicht', needsPrefix: false},
            'termine': {file: 'termine', needsPrefix: false},
            'dokumente': {file: 'documents', needsPrefix: false},
            'dokumentenverwaltung': {file: 'dokumentenverwaltung', needsPrefix: false},
            'berichte': {file: 'berichte', needsPrefix: false},
            'makleruebersicht': {file: 'makleruebersicht', needsPrefix: false},
            'einstellungen': {file: 'einstellungen', needsPrefix: false},
            'system-logs': {file: 'system-logs', needsPrefix: false},
            'supportanfragen': {file: 'supportanfragen', needsPrefix: false},
            'schulungen': {file: 'schulungen', needsPrefix: false},
            'angebotsrechner': {file: 'angebotsrechner', needsPrefix: false},
            'kommunikation': {file: 'kommunikation', needsPrefix: false},
            'leistungsuebersicht': {file: 'leistungsuebersicht', needsPrefix: false}
        };

        // Hole das Mapping für das Modul
        const mapping = moduleMapping[moduleName];
        if (!mapping) {
            console.error('Unbekanntes Modul:', moduleName);
            return;
        }

        // Cleanup vor dem Laden des neuen Moduls
        this.cleanupCurrentModule();

        // Lade das Modul mit oder ohne Prefix
        if (mapping.needsPrefix) {
            const rolePrefix = role.toLowerCase();
            this.loadModule(mapping.file, rolePrefix);
        } else {
            this.loadModule(mapping.file);
        }
    }

    async loadModuleScript(moduleName) {
        try {
            // Mapping für JS-Dateinamen (HTML zu JS)
            const jsFileMapping = {
                // Englisch -> Tatsächliche JS-Datei
                'customers': 'customers',
                'documents': 'documents',
                'commission': 'provisionen',
                'calendar': 'termine',
                'reports': 'berichte',
                'tickets': 'supportanfragen',
                'training': 'schulungen',
                'users': 'makleruebersicht',
                'system': 'einstellungen',
                'logs': 'systemlogs',           // JS-Datei heißt systemlogs.js
                'systemlogs': 'systemlogs',     // JS-Datei heißt systemlogs.js
                'system-logs': 'systemlogs',    // JS-Datei heißt systemlogs.js
                'calculator': 'angebotsrechner',
                'communication': 'kommunikation',
                'performance': 'leistungsuebersicht',
                'documentation': 'dokumentenverwaltung',
                
                // Deutsch -> Tatsächliche JS-Datei
                'kunden': 'customers',
                'dokumente': 'documents',
                'vertrage': 'vertrage',
                'provisionen': 'provisionen',
                'provisionsuebersicht': 'provisionsuebersicht',
                'termine': 'termine',
                'berichte': 'berichte',
                'makleruebersicht': 'makleruebersicht',
                'einstellungen': 'einstellungen',
                'system-logs': 'systemlogs',    // JS-Datei heißt systemlogs.js
                'supportanfragen': 'supportanfragen',
                'schulungen': 'schulungen',
                'angebotsrechner': 'angebotsrechner',
                'kommunikation': 'kommunikation',
                'leistungsuebersicht': 'leistungsuebersicht',
                'dokumentenverwaltung': 'dokumentenverwaltung'
            };

            // Bestimme den korrekten Dateinamen
            const mappedName = jsFileMapping[moduleName] || moduleName;
            const scriptName = mappedName.replace(/-/g, ''); // Entferne alle Bindestriche
            const scriptUrl = `js/${scriptName}.js`;
            const scriptId = `script-${scriptName}`;

            console.log('Versuche Script zu laden:', {
                originalModule: moduleName,
                mappedName: mappedName,
                scriptName: scriptName,
                scriptUrl: scriptUrl
            });

            // Entferne vorhandene Script-Tags mit dieser ID
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }

            // Prüfe ob das Script bereits im Cache ist
            if (this.moduleCache.has(scriptId)) {
                console.log('Script aus Cache laden:', scriptUrl);
                const initFunction = this.moduleCache.get(scriptId);
                if (typeof initFunction === 'function') {
                    // Warte bis DOM geladen ist
                    if (document.readyState === 'loading') {
                        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
                    }
                    await initFunction();
                }
                return;
            }

            // Lade das Script
            console.log('Lade neues Script:', scriptUrl);
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = scriptUrl;
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });

            // Warte bis DOM geladen ist
            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
            }

            // Warte kurz, damit das Script ausgeführt werden kann
            await new Promise(resolve => setTimeout(resolve, 100));

            // Suche die Initialisierungsfunktion
            let initFunction;
            
            // Spezielle Behandlung für Dashboard
            if (moduleName === 'dashboard') {
                initFunction = window['initMaklerDashboard'] || window['initBetreuerDashboard'] || window['initAdminDashboard'];
            } else {
                // Versuche verschiedene Namenskonventionen für die Init-Funktion
                const baseName = scriptName.charAt(0).toUpperCase() + scriptName.slice(1);
                initFunction = window[`init${baseName}`] || // z.B. initCustomers
                             window[`init${mappedName.charAt(0).toUpperCase() + mappedName.slice(1)}`] || // z.B. initKunden
                             window[`initialize${baseName}`]; // z.B. initializeCustomers
            }
            
            if (typeof initFunction === 'function') {
                // Cache die Funktion
                this.moduleCache.set(scriptId, initFunction);
                
                try {
                    // Stelle sicher, dass Canvas-Elemente bereit sind
                    if (moduleName === 'berichte' || moduleName === 'reports') {
                        await this.prepareChartCanvases();
                    }
                    
                    await initFunction();
                } catch (error) {
                    console.error(`Fehler bei der Initialisierung von ${moduleName}:`, error);
                    // Werfe den Fehler nicht weiter, damit die UI nicht blockiert wird
                }
            } else {
                console.log(`Keine Initialisierungsfunktion für ${moduleName} gefunden`);
            }

        } catch (error) {
            console.error('Fehler beim Laden des Scripts:', error);
            // Werfe den Fehler nicht weiter, da fehlende Scripts nicht kritisch sind
        }
    }

    async prepareChartCanvases() {
        // Warte kurz, damit das DOM aktualisiert werden kann
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Zerstöre alle existierenden Charts
        if (window.Chart) {
            if (Chart.instances) {
                Object.values(Chart.instances).forEach(chart => {
                    if (chart && typeof chart.destroy === 'function') {
                        try {
                            chart.destroy();
                        } catch (e) {
                            console.error('Fehler beim Zerstören des Charts:', e);
                        }
                    }
                });
            }
        }
        
        // Setze alle Canvas-Elemente zurück
        document.querySelectorAll('canvas[id$="Chart"]').forEach(canvas => {
            try {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = canvas.width; // Force reset
                
                // Entferne alle gespeicherten Chart-Instanzen
                if (this.chartInstances.has(canvas.id)) {
                    this.chartInstances.delete(canvas.id);
                }
            } catch (e) {
                console.error('Fehler beim Zurücksetzen des Canvas:', e);
            }
        });
        
        // Warte nochmal kurz
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    cleanupCurrentModule() {
        // Cleanup für Chart.js
        if (window.Chart) {
            // Zerstöre alle Chart-Instanzen
            if (Chart.instances) {
                Object.values(Chart.instances).forEach(chart => {
                    if (chart && typeof chart.destroy === 'function') {
                        try {
                            chart.destroy();
                        } catch (e) {
                            console.error('Fehler beim Zerstören des Charts:', e);
                        }
                    }
                });
            }
            
            // Zusätzlich alle Canvas-Elemente zurücksetzen
            document.querySelectorAll('canvas[id$="Chart"]').forEach(canvas => {
                try {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = canvas.width; // Force reset
                    
                    // Entferne alle gespeicherten Chart-Instanzen
                    if (this.chartInstances.has(canvas.id)) {
                        this.chartInstances.delete(canvas.id);
                    }
                } catch (e) {
                    console.error('Fehler beim Zurücksetzen des Canvas:', e);
                }
            });
        }
        
        // Cleanup für FullCalendar
        const calendarEls = document.querySelectorAll('.calendar');
        calendarEls.forEach(el => {
            const calendar = el._calendar;
            if (calendar && typeof calendar.destroy === 'function') {
                calendar.destroy();
            }
        });
        
        // Cleanup für React-Komponenten
        if (window.__INITIAL_STATE__) {
            window.__INITIAL_STATE__ = undefined;
        }
        const reactRoots = document.querySelectorAll('[data-reactroot]');
        reactRoots.forEach(root => {
            const container = root.parentElement;
            if (container) {
                container.innerHTML = '';
            }
        });
        
        // Entferne alle dynamisch geladenen Scripts
        const scripts = document.querySelectorAll('script[id^="script-"]');
        scripts.forEach(script => script.remove());
        
        // Leere den Cache für das aktuelle Modul
        this.moduleCache.clear();
        
        // Entferne Event-Listener von häufig verwendeten Elementen
        ['uploadBtn', 'downloadBtn', 'saveBtn', 'deleteBtn'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
            }
        });
    }

    /**
     * Lädt ein externes Skript dynamisch
     * @param {string} url - URL des zu ladenden Skripts
     * @returns {Promise} Promise, das resolved, wenn das Skript geladen ist
     */
    loadExternalScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Lädt ein externes Stylesheet dynamisch
     * @param {string} url - URL des zu ladenden Stylesheets
     * @returns {Promise} Promise, das resolved, wenn das Stylesheet geladen ist
     */
    loadExternalStylesheet(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Lädt ein Modul basierend auf dem Modulnamen
     * @param {string} moduleName - Name des zu ladenden Moduls
     * @returns {Promise<void>}
     */
    async loadModule(moduleName) {
        try {
            // Hole die aktuelle Benutzerrolle
            const role = this.getCurrentUserRole();
            console.log('Lade Modul:', moduleName, 'für Rolle:', role);
            
            // Prüfe ob das Modul für diese Rolle verfügbar ist
            if (!this.isModuleAvailableForRole(moduleName, role)) {
                throw new Error(`Modul ${moduleName} ist für Rolle ${role} nicht verfügbar`);
            }

            // Mapping der Module zu den tatsächlichen Dateinamen
            const moduleInfo = this.loadModuleForRole(moduleName, role);
            if (!moduleInfo) {
                throw new Error(`Unbekanntes Modul: ${moduleName}`);
            }

            // Lade zuerst die HTML-Datei
            const moduleUrl = moduleInfo.needsPrefix && role
                ? `modules/${role}-${moduleInfo.file}.html`
                : `modules/${moduleInfo.file}.html`;
            
            console.log('Lade HTML:', moduleUrl);
            
            const response = await fetch(moduleUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            const mainContent = document.getElementById('main-content');
            if (!mainContent) {
                throw new Error('Main content container nicht gefunden');
            }
            
            mainContent.innerHTML = content;

            // Lade spezielle Dependencies für bestimmte Module
            if (moduleInfo.file === 'schulungen') {
                await this.loadExternalStylesheet('https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/main.min.css');
                await this.loadExternalScript('https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js');
            }

            // Dann lade das zugehörige JavaScript
            const jsPath = `js/${moduleInfo.file}.js`;
            console.log('Lade Script:', jsPath);
            
            const scriptElement = document.createElement('script');
            scriptElement.src = jsPath;
            scriptElement.type = 'text/javascript';
            
            // Warte auf das Laden des Scripts
            await new Promise((resolve, reject) => {
                scriptElement.onload = resolve;
                scriptElement.onerror = reject;
                document.body.appendChild(scriptElement);
            });

            // Aktualisiere die aktive Navigation
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('data-module') === moduleName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

        } catch (error) {
            console.error(`Fehler beim Laden von Modul ${moduleName}:`, error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-danger m-3">
                        <h4 class="alert-heading">Fehler beim Laden des Moduls</h4>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }
    }

    /**
     * Gibt die aktuelle Benutzerrolle zurück
     * @returns {string} Die aktuelle Benutzerrolle
     */
    getCurrentUserRole() {
        // Hole die Rolle aus dem localStorage
        const role = localStorage.getItem('userRole');
        console.log('Aktuelle Rolle:', role);
        return role || 'betreuer'; // Fallback auf 'betreuer' wenn keine Rolle gesetzt ist
    }

    /**
     * Prüft ob ein Modul für eine bestimmte Rolle verfügbar ist
     * @param {string} moduleName - Name des Moduls
     * @param {string} role - Rolle des Benutzers
     * @returns {boolean}
     */
    isModuleAvailableForRole(moduleName, role) {
        // Normalisiere den Modulnamen (entferne Präfix falls vorhanden)
        const normalizedModule = moduleName.replace(/^(admin|betreuer|makler)-/, '');
        
        // Gemeinsame Module für alle Rollen
        const commonModules = ['dashboard'];
        if (commonModules.includes(normalizedModule)) return true;

        // Admin hat Zugriff auf alle Module
        if (role === 'admin') return true;

        // Betreuer-spezifische Module
        const betreuerModules = [
            'dashboard', 'makler', 'makleruebersicht', 'schulungen', 
            'support', 'tickets', 'berichte'
        ];
        if (role === 'betreuer' && betreuerModules.includes(normalizedModule)) return true;

        // Makler-spezifische Module
        const maklerModules = [
            'dashboard', 'vertrage', 'kunden', 'provisionen', 
            'termine', 'dokumente', 'berichte'
        ];
        if (role === 'makler' && maklerModules.includes(normalizedModule)) return true;

        console.log(`Modul ${normalizedModule} ist nicht verfügbar für Rolle ${role}`);
        return false;
    }

    /**
     * Lädt ein Modul basierend auf dem Modulnamen und der Benutzerrolle
     * @param {string} moduleName - Name des zu ladenden Moduls
     * @param {string} role - Rolle des Benutzers
     * @returns {Object|null} Modul-Informationen oder null wenn nicht gefunden
     */
    loadModuleForRole(moduleName, role) {
        console.log('Lade Modul:', moduleName, 'für Rolle:', role);
        
        // Mapping der data-module Attribute zu den tatsächlichen Dateinamen
        const moduleMapping = {
            // Dashboards (mit Rollenprefix)
            'dashboard': {file: 'dashboard', needsPrefix: true},
            
            // Hauptmodule (Englisch -> Deutsch)
            'contracts': {file: 'vertrage', needsPrefix: false},
            'customers': {file: 'customers', needsPrefix: false},
            'commission': {file: 'provisionen', needsPrefix: false},
            'calendar': {file: 'termine', needsPrefix: false},
            'documents': {file: 'documents', needsPrefix: false},
            'reports': {file: 'berichte', needsPrefix: false},
            
            // Admin Module
            'users': {file: 'makleruebersicht', needsPrefix: false},
            'system': {file: 'einstellungen', needsPrefix: false},
            'logs': {file: 'system-logs', needsPrefix: false},
            'systemlogs': {file: 'system-logs', needsPrefix: false},
            'system-logs': {file: 'system-logs', needsPrefix: false},
            
            // Betreuer Module
            'tickets': {file: 'supportanfragen', needsPrefix: false},
            'training': {file: 'schulungen', needsPrefix: false},
            'support': {file: 'support', needsPrefix: false},
            'makler': {file: 'makleruebersicht', needsPrefix: false},  // Für Betreuer-Zugriff
            'brokers': {file: 'makleruebersicht', needsPrefix: false}, // Alternative für Betreuer
            
            // Zusätzliche Module
            'calculator': {file: 'angebotsrechner', needsPrefix: false},
            'communication': {file: 'kommunikation', needsPrefix: false},
            'performance': {file: 'leistungsuebersicht', needsPrefix: false},
            'documentation': {file: 'dokumentenverwaltung', needsPrefix: false},
            
            // Legacy-Support für direkte deutsche Dateinamen
            'vertrage': {file: 'vertrage', needsPrefix: false},
            'kunden': {file: 'customers', needsPrefix: false},
            'provisionen': {file: 'provisionen', needsPrefix: false},
            'provisionsuebersicht': {file: 'provisionsuebersicht', needsPrefix: false},
            'termine': {file: 'termine', needsPrefix: false},
            'dokumente': {file: 'documents', needsPrefix: false},
            'dokumentenverwaltung': {file: 'dokumentenverwaltung', needsPrefix: false},
            'berichte': {file: 'berichte', needsPrefix: false},
            'makleruebersicht': {file: 'makleruebersicht', needsPrefix: false},
            'einstellungen': {file: 'einstellungen', needsPrefix: false},
            'system-logs': {file: 'system-logs', needsPrefix: false},
            'supportanfragen': {file: 'supportanfragen', needsPrefix: false},
            'schulungen': {file: 'schulungen', needsPrefix: false},
            'angebotsrechner': {file: 'angebotsrechner', needsPrefix: false},
            'kommunikation': {file: 'kommunikation', needsPrefix: false},
            'leistungsuebersicht': {file: 'leistungsuebersicht', needsPrefix: false}
        };

        // Prüfe ob das Modul existiert
        const moduleInfo = moduleMapping[moduleName];
        if (!moduleInfo) {
            console.error('Unbekanntes Modul:', moduleName);
            return null;
        }

        return moduleInfo;
    }

    updateActiveNavigation(moduleName) {
        // Implementiere die Logik, um die aktive Navigation zu aktualisieren
        // Für diese Implementierung wird angenommen, dass die aktive Navigation nicht aktualisiert werden muss
    }
}

// Router initialisieren
window.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
